# TruthLens — Fake News Detection Using Natural Language Processing (NLP)

> **TruthLens** is an NLP and Machine Learning based web application for classifying submitted news articles as **REAL** or **FAKE**.  
> It combines text preprocessing, TF-IDF feature extraction, traditional machine-learning classifiers, FastAPI, React, and PostgreSQL into a complete end-to-end news analysis system.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [How TruthLens Works](#how-truthlens-works)
- [System Architecture](#system-architecture)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [Machine Learning Models](#machine-learning-models)
- [Database Design](#database-design)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Dataset Import](#dataset-import)
- [Model Training](#model-training)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Application Routes](#application-routes)
- [API Endpoints](#api-endpoints)
- [Prediction Workflow](#prediction-workflow)
- [Live News Workflow](#live-news-workflow)
- [PostgreSQL Role](#postgresql-role)
- [Model Artifacts](#model-artifacts)
- [Testing and Verification](#testing-and-verification)
- [Dataset and Evaluation Note](#dataset-and-evaluation-note)
- [Security Notes](#security-notes)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Academic Project Description](#academic-project-description)
- [License](#license)

---

## Project Overview

Fake news can spread rapidly through digital platforms and can be difficult to distinguish from legitimate reporting using manual inspection alone.

**TruthLens** provides a machine-learning based approach for analyzing news text. A user submits a headline and article body, after which the backend applies the same NLP preprocessing and TF-IDF transformation used during model training. The trained classifier then predicts whether the article is **REAL** or **FAKE** and returns a model confidence value.

The application also provides:

- Detailed prediction results
- Text statistics
- Model probability information
- Multi-model analysis
- Influential TF-IDF terms
- Model performance information
- Prediction history
- Dataset statistics
- Live news retrieval
- PostgreSQL-backed persistent storage
- A futuristic, dark, neon-inspired React interface
- 3D visual components for the web experience

### Important terminology

TruthLens produces a **model-based classification**. It does not independently verify every factual claim in an article.

Therefore:

> **REAL** means that the trained model classified the submitted text as REAL.  
> **FAKE** means that the trained model classified the submitted text as FAKE.

The result should not be interpreted as an absolute factual verdict.

---

# Key Features

## 1. News Analyzer

Users can submit:

- News headline
- News article content

The application validates the input and sends it to the FastAPI backend for analysis.

---

## 2. NLP-Based Text Processing

The project applies text preprocessing before feature extraction.

The preprocessing pipeline includes operations such as:

- Lowercasing
- Removing unwanted bracketed content
- Removing URLs
- Removing HTML-related content
- Removing punctuation and unnecessary characters
- Removing words containing digits where applicable
- Normalizing the text
- Combining headline and article content

The same preprocessing logic is reused during prediction to keep training and inference consistent.

---

## 3. TF-IDF Feature Extraction

TruthLens uses **TF-IDF (Term Frequency–Inverse Document Frequency)** to convert news text into numerical features that can be processed by machine-learning models.

The current training configuration also uses:

- English stop-word filtering
- Sublinear TF scaling

These settings reduce the influence of common English filler words and adjust term-frequency scaling.

---

## 4. Multiple Machine Learning Models

The project includes four traditional ML classifiers:

1. Logistic Regression
2. Decision Tree Classifier
3. Gradient Boosting Classifier
4. Random Forest Classifier

The trained models can also be used for article-level multi-model analysis.

---

## 5. Model Confidence

For predictions that support probability estimates, TruthLens reports the model's probability-based confidence for the predicted class.

Example:

```text
Prediction: REAL
Model Confidence: 91.2%
```

This is **model confidence**, not a guarantee that the article is factually true.

---

## 6. Prediction History

Prediction records can be stored in PostgreSQL, including information such as:

- Submitted headline
- Submitted content
- Prediction
- Confidence
- Model name
- Processing time
- Timestamp

---

## 7. Live News

The application includes a Live News page that retrieves articles through the backend.

The current implementation uses **GNews** as the external news provider.

Supported capabilities include:

- Category filtering
- Search
- Country selection
- Language selection
- Pagination
- Caching
- Article metadata
- "Analyze with TruthLens" workflow

A live article is **not automatically considered true** merely because it came from a news API. Users can send it to the TruthLens analyzer for model-based classification.

---

## 8. PostgreSQL Integration

PostgreSQL is used as the persistent data layer.

It stores:

- Training dataset records
- Prediction history
- Model metrics
- Model version information
- Cached live-news records

The ML model performs classification; PostgreSQL stores and retrieves the application's structured data.

---

# How TruthLens Works

```text
                    USER
                      |
                      v
             React Frontend
                      |
                      v
              News Analyzer
                      |
                      v
              FastAPI Backend
                      |
                      v
             Text Preprocessing
                      |
                      v
                  TF-IDF
                      |
                      v
              ML Classification
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       REAL/FAKE   Confidence   Model Info
          |           |           |
          +-----------+-----------+
                      |
                      v
                 PostgreSQL
                      |
                      v
             Analysis Result Page
```

---

# System Architecture

```text
+-------------------------+
|      React Frontend     |
|-------------------------|
| Home                    |
| News Analyzer           |
| Analyzing               |
| Analysis Result         |
| Live News               |
| History                 |
| How It Works            |
| About                   |
+------------+------------+
             |
             | HTTP / REST API
             v
+-------------------------+
|       FastAPI API       |
|-------------------------|
| Prediction Routes       |
| History Routes          |
| Dashboard/Analytics     |
| Model Routes            |
| Dataset Routes          |
| Live News Routes        |
| Health Route            |
+------------+------------+
             |
       +-----+------+
       |            |
       v            v
+-------------+  +------------------+
| ML Pipeline |  |   PostgreSQL     |
|-------------|  |------------------|
| Preprocess  |  | news_dataset     |
| TF-IDF      |  | predictions      |
| LR          |  | model_metrics    |
| DT          |  | model_versions   |
| GB          |  | live_news_cache  |
| RF          |  +------------------+
+-------------+
```

---

# Machine Learning Pipeline

The training pipeline follows this process:

```text
Raw Fake.csv + True.csv
          |
          v
    Dataset Import
          |
          v
      PostgreSQL
          |
          v
     Load Dataset
          |
          v
 Combine Title + Text
          |
          v
 Text Preprocessing
          |
          v
      TF-IDF
          |
          v
 Train/Test Split
          |
          v
 +-------------------------------+
 | Logistic Regression           |
 | Decision Tree                 |
 | Gradient Boosting             |
 | Random Forest                 |
 +-------------------------------+
          |
          v
 Evaluate Models
          |
          v
 Accuracy / Precision / Recall
 F1 Score / Confusion Matrix
          |
          v
 Save Model + Vectorizer
          |
          v
 Save Metrics + Version
          |
          v
       FastAPI
```

---

# Machine Learning Models

## Logistic Regression

A linear classification algorithm used as one of the primary text-classification models.

It works well with high-dimensional sparse TF-IDF features.

---

## Decision Tree

A tree-based classifier that makes predictions using a sequence of feature-based decisions.

---

## Gradient Boosting

An ensemble method that builds multiple weak learners sequentially to improve classification performance.

---

## Random Forest

An ensemble of multiple decision trees whose predictions are combined to improve robustness.

---

# Database Design

TruthLens uses PostgreSQL with the following main tables.

## `news_dataset`

Stores the imported training dataset.

| Column | Purpose |
|---|---|
| `id` | Unique record ID |
| `title` | News headline |
| `text` | News article body |
| `subject` | News subject/category |
| `date` | Original dataset date |
| `label` | `0 = REAL`, `1 = FAKE` |
| `source_dataset` | Source CSV filename |
| `created_at` | Database insertion time |

---

## `predictions`

Stores user analysis results.

Typical information includes:

| Field | Purpose |
|---|---|
| `id` | Prediction ID |
| `headline` | Submitted headline |
| `content` | Submitted content |
| `prediction` | REAL / FAKE |
| `confidence` | Model confidence |
| `model_name` | Model used |
| `processing_time_ms` | Prediction processing time |
| `created_at` | Analysis timestamp |

---

## `model_metrics`

Stores evaluation metrics for trained models.

Examples:

- Accuracy
- Precision
- Recall
- F1 score
- Training sample count
- Test sample count
- Creation timestamp

---

## `model_versions`

Stores model-version metadata such as:

- Model name
- Version
- Vectorizer
- Training date
- Dataset size
- Model path
- Vectorizer path

---

## `live_news_cache`

Stores cached live-news information when caching is used.

Typical information includes:

- External article ID
- Title
- Description
- Content
- Source
- Author
- URL
- Image URL
- Published time
- Category
- Fetch timestamp

---

# Project Structure

The following structure represents the source architecture of the current project while excluding generated directories such as `node_modules`, `__pycache__`, and build output.

```text
News_Dectector/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── logging.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── database/
│   │   │   ├── connection.py
│   │   │   ├── session.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── ml/
│   │   │   ├── artifacts/
│   │   │   │   ├── model.pkl
│   │   │   │   ├── vectorizer.pkl
│   │   │   │   ├── all_models.pkl
│   │   │   │   ├── metrics.json
│   │   │   │   ├── model_metadata.json
│   │   │   │   └── .gitkeep
│   │   │   └── __init__.py
│   │   │
│   │   ├── models/
│   │   │   ├── news_dataset.py
│   │   │   ├── prediction.py
│   │   │   ├── model_metrics.py
│   │   │   ├── model_version.py
│   │   │   ├── live_news_cache.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── routes/
│   │   │   ├── health.py
│   │   │   ├── prediction.py
│   │   │   ├── history.py
│   │   │   ├── dashboard.py
│   │   │   ├── model.py
│   │   │   ├── dataset.py
│   │   │   ├── live_news.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── prediction.py
│   │   │   ├── history.py
│   │   │   ├── dashboard.py
│   │   │   ├── live_news.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── services/
│   │   │   ├── nlp_service.py
│   │   │   ├── prediction_service.py
│   │   │   ├── analytics_service.py
│   │   │   ├── dataset_service.py
│   │   │   ├── news_service.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── main.py
│   │   └── __init__.py
│   │
│   ├── data/
│   │   └── raw/
│   │       ├── Fake.csv
│   │       └── True.csv
│   │
│   ├── scripts/
│   │   ├── import_dataset.py
│   │   ├── train_model.py
│   │   ├── evaluate_model.py
│   │   ├── audit_test_suite.py
│   │   ├── inspect_csv.py
│   │   ├── investigate_generalization.py
│   │   ├── experiment_preprocessing_improvements.py
│   │   ├── test_prediction_cases.py
│   │   ├── test_real_false_positives.py
│   │   ├── test_arbitrary_news.py
│   │   ├── test_live.py
│   │   ├── verify_all_endpoints.py
│   │   ├── verify_postgres.py
│   │   ├── seed_csv.py
│   │   ├── generate_comprehensive_dataset.py
│   │   └── init_database.py
│   │
│   ├── check_db.py
│   ├── verify_connection_steps.py
│   ├── requirements.txt
│   └── .env
│
├── data/
│   └── raw/
│       ├── Fake.csv
│       └── True.csv
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── HeroScene.jsx
│   │   │   │   ├── HoloGlobe.jsx
│   │   │   │   └── NeuralNetwork3D.jsx
│   │   │   ├── ConfidenceMeter.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatusCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LoadingPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalyzerPage.jsx
│   │   │   ├── AnalyzingPage.jsx
│   │   │   ├── AnalysisResultPage.jsx
│   │   │   ├── LiveNewsPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── HowItWorksPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   │
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── .env
│
├── notebooks/
│   └── fake-news-detection.ipynb
│
├── .gitignore
└── README.md
```

> **Note:** `DashboardPage.jsx` exists in the source tree, while the current React router uses `/analysis-result` as the user-facing result/dashboard page. Generated folders such as `frontend/node_modules`, `frontend/dist`, Python `__pycache__`, and local ML artifacts should not be committed.

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI development |
| Vite | Frontend build tool |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Three.js | 3D graphics |
| React Three Fiber | React integration for Three.js |
| Drei | Three.js helper components |
| Recharts | Charts and analytics |
| Axios | API communication |
| Lucide React | Icons |

---

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend and ML development |
| FastAPI | REST API |
| Uvicorn | ASGI server |
| SQLAlchemy | Database ORM |
| PostgreSQL | Persistent database |
| Pydantic | Data validation |
| python-dotenv / pydantic-settings | Environment configuration |
| pandas | Dataset processing |
| NumPy | Numerical operations |
| scikit-learn | ML and TF-IDF |
| joblib | Model serialization |
| HTTPX | External API requests |

---

# Prerequisites

Install the following before running the project:

- Python 3.10+ recommended
- Node.js and npm
- PostgreSQL
- Git
- A PostgreSQL database named `truthlens`
- GNews API key if Live News is enabled

Verify installations:

```bash
python --version
node --version
npm --version
psql --version
```

---

# Installation and Setup

## 1. Clone the project

```bash
git clone <your-repository-url>
cd News_Dectector
```

---

# Backend Setup

## 2. Create a Python virtual environment

From the project root:

### Windows

```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

### macOS/Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/truthlens

MODEL_PATH=app/ml/artifacts/model.pkl
VECTORIZER_PATH=app/ml/artifacts/vectorizer.pkl
METRICS_PATH=app/ml/artifacts/metrics.json

MODEL_NAME=Logistic Regression

ADMIN_RETRAIN_KEY=YOUR_SECRET_KEY

NEWS_API_KEY=YOUR_GNEWS_API_KEY

FRONTEND_URL=http://localhost:5173

ENVIRONMENT=development
```

For the frontend create:

```text
frontend/.env
```

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Never commit real secrets

Do not commit:

```text
backend/.env
frontend/.env
```

Use `.env.example` files with placeholders when publishing the project.

---

# Database Setup

Start PostgreSQL and create the database:

```sql
CREATE DATABASE truthlens;
```

The backend uses SQLAlchemy to connect to PostgreSQL.

When the FastAPI application starts, the application verifies the connection and creates the configured database tables if they do not already exist.

You can verify the database connection with:

```bash
cd backend
python check_db.py
```

or:

```bash
python verify_connection_steps.py
```

---

# Dataset Import

The project expects two CSV files:

```text
backend/data/raw/
├── Fake.csv
└── True.csv
```

The importer maps:

```text
Fake.csv → label 1
True.csv → label 0
```

Run:

```bash
cd backend
python scripts/import_dataset.py
```

The script:

1. Locates the raw dataset.
2. Reads `Fake.csv` and `True.csv`.
3. Normalizes column names.
4. Reads title, text, subject, and date.
5. Skips rows without usable title/content.
6. Assigns the appropriate label.
7. Inserts the records into PostgreSQL.
8. Prints the final REAL/FAKE counts.

### Append mode

To append instead of clearing existing dataset records:

```bash
python scripts/import_dataset.py --append
```

---

# Model Training

The training script loads the dataset **from PostgreSQL**, rather than directly training from the CSV files.

Run:

```bash
cd backend
python scripts/train_model.py
```

The pipeline:

```text
PostgreSQL
   ↓
Load news_dataset
   ↓
Combine title + text
   ↓
Preprocess text
   ↓
TF-IDF
   ↓
Train four classifiers
   ↓
Evaluate
   ↓
Save artifacts
   ↓
Save metrics/version information
```

The trained artifacts are stored under:

```text
backend/app/ml/artifacts/
```

---

# Running the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The API is normally available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

The root endpoint returns the API status and documentation path.

---

# Running the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

---

## Production Build

Create a production frontend build:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

Lint the project:

```bash
npm run lint
```

---

# Application Routes

The current frontend contains the following user-facing routes:

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/loading` | Loading entry page |
| `/analyzer` | News input |
| `/analyzing` | Processing screen |
| `/analysis-result` | Final prediction/result dashboard |
| `/live-news` | Live news |
| `/history` | Prediction history |
| `/how-it-works` | NLP/ML explanation |
| `/about` | Project information |

### Main user flow

```text
Loading
   ↓
Home
   ↓
News Analysis
   ↓
Analyzing
   ↓
Analysis Result
```

For a normal analysis:

```text
/analyzer
    ↓
/analyzing
    ↓
/analysis-result
```

The final result page is shown only after a prediction has been generated successfully.

---

# API Endpoints

The backend exposes REST endpoints under `/api`.

## Health

```http
GET /api/health
```

Checks backend/system health.

---

## Prediction

```http
POST /api/predict
```

Submits a news headline and article body for classification.

Conceptual request:

```json
{
  "headline": "Example headline",
  "content": "Example article content..."
}
```

The response can include:

- Prediction
- Confidence
- REAL probability
- FAKE probability
- Model name
- Model version
- Processing time
- Text statistics
- Multi-model analysis
- Top influential terms
- Credibility/style indicators

---

## History

```http
GET /api/history
```

Retrieves previous prediction records.

```http
GET /api/history/{id}
```

Retrieves a specific prediction record.

---

## Dashboard / Analytics

```http
GET /api/dashboard
```

Provides dashboard-related analytics used by the application.

---

## Model Information

```http
GET /api/model/metrics
GET /api/model/info
```

Used to retrieve model evaluation and model metadata.

---

## Dataset Statistics

```http
GET /api/dataset/stats
```

Returns dataset-related statistics.

---

## Live News

```http
GET /api/live-news
```

Supported query parameters include:

```text
category
country
language
search
page
limit
```

Example:

```text
/api/live-news?category=technology&country=in&language=en
```

---

# Prediction Workflow

When the user submits news:

```text
1. User enters headline and content
                ↓
2. React sends POST /api/predict
                ↓
3. FastAPI validates request
                ↓
4. Headline + content are combined
                ↓
5. NLP preprocessing is applied
                ↓
6. Saved TF-IDF vectorizer transforms the text
                ↓
7. Production ML model predicts the class
                ↓
8. REAL/FAKE probability is calculated
                ↓
9. Multi-model analysis can be generated
                ↓
10. Prediction information is stored/retrieved
                ↓
11. Frontend displays Analysis Result
```

---

# Live News Workflow

```text
GNews API
    ↓
FastAPI /api/live-news
    ↓
Optional caching
    ↓
React Live News page
    ↓
User selects an article
    ↓
Analyze with TruthLens
    ↓
/analyzer
    ↓
User reviews/edits article
    ↓
/analyzing
    ↓
/api/predict
    ↓
/analysis-result
```

The external news provider is not used as the prediction engine.

---

# PostgreSQL Role

PostgreSQL is the application's persistent data layer.

It does **not** decide whether news is fake or real.

The responsibilities are separated:

```text
ML Model
    ↓
Performs classification

PostgreSQL
    ↓
Stores and retrieves application data
```

For example:

```text
User submits news
      ↓
ML Model
      ↓
Prediction = REAL
Confidence = 91.2%
      ↓
PostgreSQL
      ↓
Stores prediction/history information
```

This separation makes the system easier to maintain and extend.

---

# Model Artifacts

The trained ML pipeline produces artifacts such as:

```text
backend/app/ml/artifacts/
├── model.pkl
├── vectorizer.pkl
├── all_models.pkl
├── metrics.json
└── model_metadata.json
```

## `model.pkl`

Primary production classifier.

## `vectorizer.pkl`

The fitted TF-IDF vectorizer used to transform incoming news into the same feature space used during training.

## `all_models.pkl`

Stores the available trained models for multi-model analysis.

## `metrics.json`

Stores model evaluation information.

## `model_metadata.json`

Stores model/version-related metadata.

These files should be regenerated when the training dataset or training configuration changes.

---

# Testing and Verification

The project contains several scripts for verification and experimentation.

Examples:

```bash
python scripts/evaluate_model.py
```

```bash
python scripts/audit_test_suite.py
```

```bash
python scripts/test_prediction_cases.py
```

```bash
python scripts/test_real_false_positives.py
```

```bash
python scripts/test_arbitrary_news.py
```

```bash
python scripts/verify_all_endpoints.py
```

```bash
python scripts/verify_postgres.py
```

For Live News:

```bash
python scripts/test_live.py
```

These scripts can be used to verify:

- PostgreSQL connectivity
- Dataset import
- Model training
- Model artifacts
- Prediction behavior
- API endpoints
- Live News integration
- Generalization experiments

---

# Dataset and Evaluation Note

## Current dataset status

The project currently contains `Fake.csv` and `True.csv` under the raw-data directories.

The current files were previously audited and found to contain only:

```text
Fake.csv → 506 rows
True.csv → 506 rows
```

with only **22 unique articles in each file**, repeated multiple times.

This creates a serious risk of train/test leakage because identical articles can appear in both training and test subsets.

As a result:

> A very high or 100% test accuracy on this repeated dataset should **not** be interpreted as production-level generalization.

The project should be retrained and reevaluated using the complete intended dataset with duplicate/leakage checks before presenting final ML performance claims.

### Recommended evaluation

For a production-quality evaluation:

- Use the complete dataset.
- Remove exact duplicates.
- Check for near-duplicate leakage.
- Keep training and test articles independent.
- Use a proper stratified split.
- Evaluate all four classifiers.
- Report:
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - Confusion Matrix
  - False Positive Rate
  - False Negative Rate

Do not use Reuters presence, specific keywords, or source names as a substitute for the REAL/FAKE label.

---

# Security Notes

## Never commit secrets

The project uses environment variables for:

- PostgreSQL credentials
- GNews API key
- Admin/retraining secret
- Frontend/backend configuration

Keep:

```text
backend/.env
frontend/.env
```

out of Git.

The `.gitignore` is configured to ignore `.env` files.

Before publishing the repository:

1. Remove any exposed API keys.
2. Regenerate any key that has previously been shared publicly.
3. Keep only placeholders in `.env.example`.
4. Verify that secrets are not present in Git history.

---

# Limitations

TruthLens is a machine-learning classification system and has important limitations.

### 1. Model-based classification

The system predicts based on patterns learned from its training data. It does not independently establish whether every factual statement is true.

### 2. Dataset dependency

Model performance depends strongly on:

- Dataset quality
- Dataset size
- Topic diversity
- Source diversity
- Label quality
- Duplicate removal
- Train/test separation

### 3. Distribution shift

News language changes over time. A model trained on historical articles may perform differently on new topics, publishers, writing styles, and events.

### 4. Confidence is not certainty

A 95% model confidence value does not mean there is a 95% guarantee that the article is factually true.

### 5. External news sources

Live News provides articles from an external news provider. Availability and content depend on that provider's API and current data.

---

# Future Improvements

Possible future improvements include:

- Training on a larger, diverse, deduplicated corpus
- Cross-validation with leakage controls
- Source-diversity evaluation
- Temporal evaluation on newer news
- Better calibration of confidence scores
- Explainable AI features
- More advanced NLP representations
- Transformer-based comparison models
- Fact-checking source integration
- Citation-aware verification
- More robust adversarial testing
- Automated model retraining pipeline
- Docker deployment
- Cloud deployment
- Monitoring and model-drift detection

These improvements should be evaluated without replacing the project's existing TF-IDF + traditional ML methodology unless a future version explicitly introduces a different architecture.

---

# Academic Project Description

## Short Description

**TruthLens is a Fake News Detection system developed using Natural Language Processing and Machine Learning. The system preprocesses news text, converts it into numerical TF-IDF features, and uses multiple machine-learning classifiers to classify the submitted news as REAL or FAKE. FastAPI provides the backend REST API, React provides the interactive frontend, and PostgreSQL stores the dataset, prediction history, model metrics, model versions, and cached live-news information.**

---

## Problem Statement

The rapid spread of misinformation on digital platforms creates a need for automated systems that can assist users in identifying potentially misleading news content.

TruthLens addresses this problem by applying NLP-based text processing and machine-learning classification to submitted news articles.

---

## Objectives

1. Build an NLP-based fake news classification system.
2. Preprocess news text consistently.
3. Convert text into TF-IDF numerical features.
4. Train multiple machine-learning classifiers.
5. Provide a web-based news analysis interface.
6. Store dataset and prediction information in PostgreSQL.
7. Provide model metrics and analysis history.
8. Integrate live news retrieval for user-selected analysis.
9. Provide an understandable result and confidence interface.

---

# Complete End-to-End Flow

```text
                    ┌────────────────────┐
                    │      User          │
                    └─────────┬──────────┘
                              │
                              v
                    ┌────────────────────┐
                    │ React Frontend     │
                    │ TruthLens UI       │
                    └─────────┬──────────┘
                              │
                              v
                    ┌────────────────────┐
                    │ FastAPI Backend    │
                    └─────────┬──────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                v                           v
      ┌─────────────────┐        ┌──────────────────┐
      │ NLP Processing  │        │ PostgreSQL       │
      │                 │        │                  │
      │ Cleaning        │        │ Dataset          │
      │ TF-IDF          │        │ Predictions      │
      └────────┬────────┘        │ Metrics          │
               │                 │ Versions         │
               v                 │ Live News Cache  │
      ┌─────────────────┐        └──────────────────┘
      │ ML Classifiers  │
      │                 │
      │ Logistic Reg.   │
      │ Decision Tree   │
      │ Gradient Boost  │
      │ Random Forest   │
      └────────┬────────┘
               │
               v
      ┌─────────────────┐
      │ REAL / FAKE     │
      │ Confidence      │
      │ Model Analysis  │
      └────────┬────────┘
               │
               v
      ┌─────────────────┐
      │ Result Dashboard│
      └─────────────────┘
```

---

# Development Notes

## Backend code organization

The backend follows a layered structure:

```text
Routes
  ↓
Schemas
  ↓
Services
  ↓
Models / Database
```

### Routes

Handle HTTP requests and responses.

### Schemas

Define and validate API data structures.

### Services

Contain application logic such as:

- NLP processing
- Prediction
- Analytics
- Dataset operations
- Live-news retrieval

### Models

Represent PostgreSQL database tables.

### Core

Contains configuration and logging utilities.

---

## Frontend code organization

The frontend separates:

```text
Pages
Components
3D Components
Hooks
Context
API Configuration
```

This allows the UI to remain modular and easier to maintain.

---

# Git and Repository Hygiene

Before pushing to GitHub:

```bash
git status
```

Make sure the following are not committed:

```text
.env
node_modules/
__pycache__/
frontend/dist/
*.pkl
*.json model artifacts
large raw datasets
logs/
```

The repository should contain source code and configuration templates rather than local secrets and generated dependencies.

---

# License

This project is intended as an academic/software engineering project.

If this project is distributed publicly, add the license required by your institution, team, or repository owner.
