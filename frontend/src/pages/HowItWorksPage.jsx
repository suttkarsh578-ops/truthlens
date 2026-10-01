import { motion } from 'framer-motion';
import { Database, BrainCircuit, Activity, AlertTriangle, ArrowRight, ArrowDown, Code, Server, FileText, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="bg-[#000000] text-white pt-36 sm:pt-40 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How TruthLens Works
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-2">
            From raw news to intelligent analysis in a few simple steps.
          </p>
        </div>

        {/* ================= 1. ML TRAINING ARCHITECTURE PIPELINE ================= */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              1. Training Pipeline & Model Serialization
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#05070f] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-x-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 min-w-[750px]">
              
              {/* Step 1 */}
              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-cyan-500/30 text-center w-full">
                <Database className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">Dataset</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(Fake + True CSV)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 hidden lg:block" />

              {/* Step 2 */}
              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-teal-500/30 text-center w-full">
                <Database className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">PostgreSQL</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(Database Table)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-teal-400 flex-shrink-0 hidden lg:block" />

              {/* Step 3 */}
              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-purple-500/30 text-center w-full">
                <BrainCircuit className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">Preprocessing</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(Text Cleaning)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400 flex-shrink-0 hidden lg:block" />

              {/* Step 4 */}
              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-pink-500/30 text-center w-full">
                <FileText className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">TF-IDF</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(Vectorization)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-pink-400 flex-shrink-0 hidden lg:block" />

              {/* Step 5 */}
              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-amber-500/30 text-center w-full">
                <Cpu className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">ML Training</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(4 Classifiers)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0 hidden lg:block" />

              {/* Step 6 */}
              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-emerald-500/40 text-center w-full shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">Saved Model</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">& Vectorizer.pkl</div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. LIVE INFERENCE FLOW ================= */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#ec4899]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-pink-300">
              2. Live Prediction & Telemetry Flow
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#05070f] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-x-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 min-w-[700px]">
              
              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-cyan-500/30 text-center w-full">
                <FileText className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">User Input</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(Headline + Text)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 hidden lg:block" />

              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-purple-500/30 text-center w-full">
                <Server className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">FastAPI</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(NLP Service)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400 flex-shrink-0 hidden lg:block" />

              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-pink-500/30 text-center w-full">
                <Activity className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">Prediction</div>
                <div className="text-[10px] text-pink-300 mt-0.5">(REAL / FAKE)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-pink-400 flex-shrink-0 hidden lg:block" />

              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-teal-500/30 text-center w-full">
                <Database className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">PostgreSQL</div>
                <div className="text-[10px] text-gray-400 mt-0.5">(Predictions Log)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-teal-400 flex-shrink-0 hidden lg:block" />

              <div className="flex-1 p-4 rounded-2xl bg-black/80 border border-emerald-500/40 text-center w-full shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Activity className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">Dashboard</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">(Real-time Charts)</div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 3. DATABASE ARCHITECTURE (ITEM 9 IN DESIGN SHEET) ================= */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-300">
              3. PostgreSQL Database Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Table 1 */}
            <div className="p-5 rounded-2xl bg-[#05070f] border border-blue-500/30 space-y-2">
              <div className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> news_dataset
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                id, title, text, subject, date, label, source_dataset, created_at
              </p>
            </div>

            {/* Table 2 */}
            <div className="p-5 rounded-2xl bg-[#05070f] border border-cyan-500/30 space-y-2">
              <div className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> predictions
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                id, headline, content, prediction, confidence, model_name, processing_time, created_at
              </p>
            </div>

            {/* Table 3 */}
            <div className="p-5 rounded-2xl bg-[#05070f] border border-purple-500/30 space-y-2">
              <div className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> model_metrics
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                id, model_name, accuracy, precision, recall, f1_score, training_samples, test_samples, created_at
              </p>
            </div>

            {/* Table 4 */}
            <div className="p-5 rounded-2xl bg-[#05070f] border border-pink-500/30 space-y-2">
              <div className="text-xs font-extrabold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> model_versions
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                id, model_name, version, vectorizer_name, training_date, dataset_size, model_path, vectorizer_path, created_at
              </p>
            </div>

          </div>
        </section>

        {/* ================= 4. API ENDPOINTS (ITEM 10 IN DESIGN SHEET) ================= */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-300">
              4. Complete REST API Endpoints
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-[#05070f] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                    <span className="font-mono text-gray-200">/api/health</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">System health check</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">POST</span>
                    <span className="font-mono text-gray-200">/api/predict</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">Run NLP prediction</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                    <span className="font-mono text-gray-200">/api/history</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">Paginated history</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                    <span className="font-mono text-gray-200">/api/history/&#123;id&#125;</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">Get single analysis</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                    <span className="font-mono text-gray-200">/api/dashboard</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">Analytics & charts</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                    <span className="font-mono text-gray-200">/api/model/metrics</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">All model metrics</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                    <span className="font-mono text-gray-200">/api/dataset/stats</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">Dataset distribution</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-pink-500/20 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">POST</span>
                    <span className="font-mono text-gray-200">/api/model/admin/retrain</span>
                  </div>
                  <span className="text-pink-300 text-[11px]">Protected retrain</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Shared Code Snippet */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#05070f] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Shared NLP Preprocessing Implementation
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            The exact same preprocessing routine is executed during ML training and user prediction requests to guarantee zero data skew.
          </p>
          <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
{`def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\\[.*?\\]', '', text)               # remove bracketed content
    text = re.sub(r'https?://\\S+|www\\.\\S+', '', text)    # remove URLs
    text = re.sub(r'<.*?>', '', text)                 # remove HTML tags
    text = re.sub(r'[%s]' % re.escape(punctuation), '', text) # remove punctuation
    text = re.sub(r'\\n', ' ', text)                   # remove newlines
    text = re.sub(r'\\w*\\d\\w*', '', text)             # remove words with digits
    text = re.sub(r'\\s+', ' ', text).strip()          # normalize whitespace
    return text`}
          </pre>
        </div>

      </div>
    </div>
  );
}
