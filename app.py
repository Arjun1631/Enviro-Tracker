import streamlit as st
import streamlit.components.v1 as components
import os

# Set page config
st.set_page_config(page_title="EnviroTrack AI Monitoring System", layout="wide")

# Title
st.title("🌎 EnviroTrack AI Monitoring Dashboard")

# Path to your built index.html
html_file_path = os.path.join('dist', 'index.html')

# Check if file exists
if os.path.exists(html_file_path):
    # Read the HTML file
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Display HTML inside Streamlit app
    components.html(html_content, height=900, width=1400)
else:
    st.error("index.html not found. Please ensure you have built the project and 'dist/index.html' exists.")
