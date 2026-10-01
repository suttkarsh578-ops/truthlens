import re
import string

def preprocess_text(text: str) -> str:
    if not text or not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)  # remove bracketed content
    text = re.sub(r'https?://\S+|www\.\S+', '', text)  # remove URLs
    text = re.sub(r'<.*?>+', '', text)  # remove HTML tags
    text = re.sub(r'[^\w\s]', ' ', text)  # remove punctuation and non-alphanumeric symbols
    text = re.sub(r'\n', ' ', text)  # remove newlines
    text = re.sub(r'\w*\d\w*', '', text)  # remove words with digits
    text = re.sub(r'\s+', ' ', text).strip()  # normalize whitespace
    return text

def combine_text(headline: str, content: str) -> str:
    parts = []
    if headline and headline.strip():
        parts.append(headline.strip())
    if content and content.strip():
        parts.append(content.strip())
    return ' '.join(parts)

