import os
import joblib
import time
import re
import math
from fastapi import HTTPException
from app.core.config import settings
from app.services.nlp_service import preprocess_text, combine_text


def resolve_backend_path(path_str: str) -> str:
    if os.path.isabs(path_str):
        return path_str
    if os.path.exists(path_str):
        return path_str
    backend_rel = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), path_str)
    if os.path.exists(backend_rel):
        return backend_rel
    return path_str


class PredictionService:
    def __init__(self):
        self.model = None
        self.all_models = {}
        self.vectorizer = None
        self.model_name = settings.MODEL_NAME
        self.model_version = "1.0"

    def reload_artifacts(self):
        self.model = None
        self.all_models = {}
        self.vectorizer = None
        self._load_artifacts()

    def _load_artifacts(self):
        if self.model is None or self.vectorizer is None:
            model_p = resolve_backend_path(settings.MODEL_PATH)
            vec_p = resolve_backend_path(settings.VECTORIZER_PATH)
            artifacts_dir = os.path.dirname(model_p)
            all_models_p = os.path.join(artifacts_dir, "all_models.pkl")

            if not os.path.exists(model_p) or not os.path.exists(vec_p):
                raise HTTPException(
                    status_code=503,
                    detail="ML Model artifacts not found. Please train models first."
                )
            try:
                self.model = joblib.load(model_p)
                self.vectorizer = joblib.load(vec_p)
                self.model_name = getattr(settings, 'MODEL_NAME', 'Logistic Regression')

                if os.path.exists(all_models_p):
                    try:
                        self.all_models = joblib.load(all_models_p)
                    except Exception:
                        self.all_models = {self.model_name: self.model}
                else:
                    self.all_models = {self.model_name: self.model}
            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"Error loading trained ML model: {str(e)}"
                )

    def predict(self, headline: str, content: str) -> dict:
        self._load_artifacts()

        start_time = time.time()

        combined_raw = combine_text(headline or "", content or "")
        if not combined_raw.strip():
            raise HTTPException(status_code=400, detail="At least headline or content must be provided.")

        processed = preprocess_text(combined_raw)
        if not processed:
            processed = combined_raw.lower().strip()
            if not processed:
                raise HTTPException(status_code=400, detail="Not enough valid text characters to process.")

        # 1. Scikit-learn TF-IDF Vectorization
        vectorized = self.vectorizer.transform([processed])
        
        # 2. Primary Model Prediction & Probability Distribution
        classes = list(getattr(self.model, 'classes_', [0, 1]))
        idx_0 = classes.index(0) if 0 in classes else 0
        idx_1 = classes.index(1) if 1 in classes else 1

        if hasattr(self.model, 'predict_proba'):
            probs = self.model.predict_proba(vectorized)[0]
            prob_real = round(float(probs[idx_0]) * 100.0, 2)
            prob_fake = round(float(probs[idx_1]) * 100.0, 2)

            if prob_fake >= prob_real:
                prediction = 'FAKE'
                confidence = prob_fake
            else:
                prediction = 'REAL'
                confidence = prob_real
        else:
            pred_val = int(self.model.predict(vectorized)[0])
            if pred_val == 1:
                prediction = 'FAKE'
                confidence = 85.0
                prob_real = 15.0
                prob_fake = 85.0
            else:
                prediction = 'REAL'
                confidence = 85.0
                prob_real = 85.0
                prob_fake = 15.0

        # 3. Multi-Model Consensus on THIS specific article
        multi_model_analysis = []
        for name, m in self.all_models.items():
            try:
                m_classes = list(getattr(m, 'classes_', [0, 1]))
                m_idx_0 = m_classes.index(0) if 0 in m_classes else 0
                m_idx_1 = m_classes.index(1) if 1 in m_classes else 1
                if hasattr(m, 'predict_proba'):
                    m_probs = m.predict_proba(vectorized)[0]
                    m_real = round(float(m_probs[m_idx_0]) * 100.0, 1)
                    m_fake = round(float(m_probs[m_idx_1]) * 100.0, 1)
                    m_pred = 'FAKE' if m_fake >= m_real else 'REAL'
                    m_conf = m_fake if m_pred == 'FAKE' else m_real
                else:
                    m_val = int(m.predict(vectorized)[0])
                    m_pred = 'FAKE' if m_val == 1 else 'REAL'
                    m_real = 0.0 if m_pred == 'FAKE' else 100.0
                    m_fake = 100.0 if m_pred == 'FAKE' else 0.0
                    m_conf = 85.0

                multi_model_analysis.push if False else multi_model_analysis.append({
                    "name": name,
                    "prediction": m_pred,
                    "confidence": m_conf,
                    "real_prob": m_real,
                    "fake_prob": m_fake
                })
            except Exception:
                continue

        if not multi_model_analysis:
            multi_model_analysis = [{
                "name": self.model_name,
                "prediction": prediction,
                "confidence": confidence,
                "real_prob": prob_real,
                "fake_prob": prob_fake
            }]

        # 4. Extract Top Informative Keywords from THIS article
        feature_names = self.vectorizer.get_feature_names_out()
        nz_indices = vectorized.nonzero()[1]
        weights = vectorized.data
        coefs = self.model.coef_[0] if hasattr(self.model, 'coef_') else None

        extracted_keywords = []
        for idx, weight in zip(nz_indices, weights):
            feat = feature_names[idx]
            coef = float(coefs[idx]) if coefs is not None else 0.0
            tendency = 'Fake-Leaning' if coef > 0 else 'Real-Leaning'
            extracted_keywords.append({
                'word': feat,
                'weight': round(float(weight) * 100, 1),
                'impact': round(float(coef), 3),
                'tendency': tendency
            })

        extracted_keywords.sort(key=lambda x: x['weight'], reverse=True)
        top_keywords = extracted_keywords[:8]

        # 5. Dynamic Credibility & Style Fingerprint for THIS article
        words_list = combined_raw.split()
        unique_words = len(set(w.lower() for w in words_list)) if words_list else 1
        sentences_list = [s for s in re.split(r'[.!?]+', combined_raw) if s.strip()]
        sentence_count = len(sentences_list) if sentences_list else 1

        # Lexical Diversity
        lex_diversity = round(min(98.0, max(25.0, (unique_words / max(1, len(words_list))) * 100.0)), 1)
        
        # Sensationalism Index (exclamations, capital words, urgent tone)
        exclamation_count = combined_raw.count('!')
        caps_words = sum(1 for w in words_list if w.isupper() and len(w) > 1)
        sensational_base = (exclamation_count * 15.0) + (caps_words * 8.0)
        if prediction == 'FAKE':
            sensational_score = min(96.0, max(45.0, sensational_base + (prob_fake * 0.4)))
        else:
            sensational_score = max(5.0, min(35.0, sensational_base + (prob_fake * 0.2)))
        sensational_score = round(sensational_score, 1)

        # Factual Objectivity
        if prediction == 'REAL':
            objectivity_score = round(min(96.0, max(60.0, prob_real * 0.95)), 1)
        else:
            objectivity_score = round(max(8.0, min(48.0, prob_real * 0.9)), 1)

        # Attribution / Source Density (quotes, named patterns, dates, numbers)
        quote_count = combined_raw.count('"') + combined_raw.count('“') + combined_raw.count('”')
        number_count = len(re.findall(r'\b\d+\b', combined_raw))
        attribution_score = round(min(95.0, max(20.0, 30.0 + (quote_count * 12.0) + (number_count * 6.0))), 1)

        # Structural Depth
        avg_sentence_len = len(words_list) / max(1, sentence_count)
        structural_depth = round(min(95.0, max(30.0, min(avg_sentence_len * 4.0, 90.0))), 1)

        credibility_indicators = {
            "objectivity": objectivity_score,
            "lexical_richness": lex_diversity,
            "sensationalism": sensational_score,
            "attribution_density": attribution_score,
            "structural_depth": structural_depth
        }

        processing_time_ms = max(1, int((time.time() - start_time) * 1000))

        text_stats = {
            "characters": len(combined_raw),
            "words": len(words_list),
            "sentences": sentence_count,
            "processed_length": len(processed)
        }

        return {
            "prediction": prediction,
            "confidence": confidence,
            "model_probabilities": {
                "real_prob": prob_real,
                "fake_prob": prob_fake
            },
            "multi_model_analysis": multi_model_analysis,
            "top_keywords": top_keywords,
            "credibility_indicators": credibility_indicators,
            "model_name": self.model_name,
            "model_version": self.model_version,
            "processing_time_ms": processing_time_ms,
            "headline": headline or "",
            "content": content or "",
            "text_statistics": text_stats,
            "word_count": len(words_list),
            "char_count": len(combined_raw),
            "processed_length": len(processed)
        }

    def get_model_info(self) -> dict:
        self._load_artifacts()
        return {
            "model_type": type(self.model).__name__ if self.model else None,
            "vectorizer_type": type(self.vectorizer).__name__ if self.vectorizer else None,
            "model_name": self.model_name,
            "model_path": settings.MODEL_PATH,
            "vectorizer_path": settings.VECTORIZER_PATH
        }


prediction_service = PredictionService()


