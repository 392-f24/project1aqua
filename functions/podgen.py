import os
import requests
import json
import re
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import argparse
from bs4 import BeautifulSoup
import shutil
import openai
from pydub import AudioSegment  # Make sure to install this library

# Step 1: Load API keys from the .env file
load_dotenv()
news_api_key = os.getenv('NEWS_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')

openai.api_key = openai_api_key

# Step 2: Define global variables for directories (created later with appropriate names)
base_dir = None
html_dir = None
text_dir = None
output_dir = None
summaries_dir = None

# Step 3: Function to fetch articles from NewsAPI
def fetch_articles(query, from_date, api_key, num_articles):
    url = "https://newsapi.org/v2/everything"
    params = {
        'q': query,
        'from': from_date,
        'sortBy': 'relevancy',
        'pageSize': num_articles,
        'apiKey': api_key
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching articles: {response.status_code}")
        return None

# Step 4: Download articles as HTML files
def download_html_articles(data):
    for i, article in enumerate(data['articles']):
        url = article['url']
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an error for bad responses
            file_name = f"{html_dir}/article_{i+1}.html"
            with open(file_name, 'w', encoding='utf-8') as html_file:
                html_file.write(response.text)
            print(f"Downloaded {url} to {file_name}")
        except requests.RequestException as e:
            print(f"Failed to download {url}: {e}")

# Step 5: Convert HTML to text
def convert_html_to_text():
    for html_file in os.listdir(html_dir):
        if html_file.endswith(".html"):
            html_path = os.path.join(html_dir, html_file)
            text_path = os.path.join(text_dir, f"{os.path.splitext(html_file)[0]}.txt")
            with open(html_path, 'r', encoding='utf-8') as file:
                soup = BeautifulSoup(file, 'html.parser')
                for script in soup(["script", "style"]):
                    script.extract()  # Remove script/style elements
                text = soup.get_text(separator="\n")
                lines = (line.strip() for line in text.splitlines())
                cleaned_text = '\n'.join(line for line in lines if line)
                with open(text_path, 'w', encoding='utf-8') as text_file:
                    text_file.write(cleaned_text)
            print(f"Converted {html_file} to readable text at {text_path}")

# Step 6: Function to send text to GPT-4o-mini API and receive a response
def ask_gpt(text, query):
    prompt = f"Is the following article NOT an advertisement for a product or service, very interesting and relevant to the search keyword of '{query}'? If so, reply only with YES. If not, reply only with NO. Be extremely selective, only choosing big news.\n\n{text}"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10  # Limit the response tokens since we only need "YES" or "NO"
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error querying OpenAI API: {e}")
        return None

# Step 7: Check relevance and move files
def check_relevance_and_move_files(query):
    for text_file in os.listdir(text_dir):
        if text_file.endswith(".txt"):
            text_path = os.path.join(text_dir, text_file)
            with open(text_path, 'r', encoding='utf-8') as file:
                text_content = file.read()
            gpt_response = ask_gpt(text_content, query)
            if gpt_response == "YES":
                shutil.move(text_path, os.path.join(output_dir, text_file))
                print(f"Moved {text_file} to news_text based on GPT response.")
            else:
                print(f"{text_file} is not relevant to '{query}'.")

# Step 8: Generate summaries for relevant articles
def generate_summary(text):
    prompt = f"Summarize the following article in a concise manner, including all relevant details:\n\n{text}"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500  # Adjust token limit based on how long you'd like the summary to be
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error querying OpenAI API: {e}")
        return None

# Step 9: Create summaries for relevant articles
def create_summaries():
    for text_file in os.listdir(output_dir):
        if text_file.endswith(".txt"):
            text_path = os.path.join(output_dir, text_file)
            with open(text_path, 'r', encoding='utf-8') as file:
                text_content = file.read()
            summary = generate_summary(text_content)
            if summary:
                summary_path = os.path.join(summaries_dir, f"{os.path.splitext(text_file)[0]}_summary.txt")
                with open(summary_path, 'w', encoding='utf-8') as summary_file:
                    summary_file.write(summary)
                print(f"Generated summary for {text_file} and saved it to {summary_path}")
            else:
                print(f"Failed to generate summary for {text_file}.")

# Step 10: Aggregate summaries
def aggregate_summaries():
    aggregated_text = ""
    for summary_file in os.listdir(summaries_dir):
        if summary_file.endswith(".txt"):
            summary_path = os.path.join(summaries_dir, summary_file)
            with open(summary_path, 'r', encoding='utf-8') as file:
                summary_content = file.read()
                aggregated_text += summary_content + "\n\n"

    return aggregated_text.strip()

# Step 11: Generate podcast script using GPT-4o-mini
def generate_podcast_script(aggregated_summaries, query):
    prompt = f"""
    Welcome to Flash Briefs' Daily '{query}' Recap! Today, we're diving into the latest and greatest from the '{query}' world! Here are the top '{query}' stories of the day:

    {aggregated_summaries}

    Now, I want you to create a 5-minute podcast script based on these summaries. Give the users a warm welcome from Flash Brief! Take your time reading through all the news, being sure to discuss each point, and arrange your points in a thoughtful manner, elaborating on each engagingly clearly with the subject matter. The script should be thorough, playful, engaging, and entertaining. Make sure it feels like a warm conversation with the listeners. Add some light humor, enthusiasm, and a friendly tone. Let's keep the energy up and make news fun! The script will only contain readable content, ABSOLUTELY NO additional notes or effects, jingles, transitions, songs, or notes about who is speaking. Just the words in English to be read on a teleprompter. Do not cover any information that is about a product or service unless it is absolutely groundbreaking and paradigm shifting.
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Answer with as many words as possible!"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=16384  # Adjust token limit to fit a 5-minute script
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error querying OpenAI API: {e}")
        return None

# Step 12: Save podcast script to file
def save_podcast_script(script):
    podcast_script_path = Path(base_dir) / "podcast_script.txt"
    with open(podcast_script_path, 'w', encoding='utf-8') as script_file:
        script_file.write(script)
    print(f"Podcast script generated and saved to {podcast_script_path}")

# Step 13: Summarize podcast script
def summarize_podcast_script(script):
    prompt = f"Summarize the following podcast script in a very brief, concise manner, without using bullet points Just simple text, nothing fancy. Write only one paragraph, and nothing more:\n\n{script}"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500  # Adjust token limit based on how long you'd like the summary to be
        )
        summary = response['choices'][0]['message']['content'].strip()
        
        summary_path = Path(base_dir) / "summary.txt"
        with open(summary_path, 'w', encoding='utf-8') as summary_file:
            summary_file.write(summary)
        print(f"Generated summary for podcast script and saved it to {summary_path}")

    except Exception as e:
        print(f"Error querying OpenAI API: {e}")
        return None

def small_summarize_podcast_script(script):
    prompt = f"In a numbered list, summarize the following podcast in an EXTREMELY concise, brief manner. Include only the 4 most juicy, paradigm shifting, or dramatic topics covered. Each bulletpoint should be no more than 6 words! EXTREMELY SHORT BULLET POINTS. Once you think it's too short, make it even shorter. Then, shorter again.:\n\n{script}"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=60  # Adjust token limit based on how long you'd like the summary to be
        )
        summary = response['choices'][0]['message']['content'].strip()
        
        summary_path = Path(base_dir) / "smallsummary.txt"
        with open(summary_path, 'w', encoding='utf-8') as summary_file:
            summary_file.write(summary)
        print(f"Generated summary for podcast script and saved it to {summary_path}")

    except Exception as e:
        print(f"Error querying OpenAI API: {e}")
        return None


# Step 14: Split podcast script into chunks
def split_text_into_chunks(text, max_length):
    sentences = re.split(r'(?<=[.!?]) +', text)  # Split by sentence ending
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_length:
            current_chunk += sentence + " "
        else:
            if current_chunk:  # Add the current chunk if it's not empty
                chunks.append(current_chunk.strip())
            current_chunk = sentence + " "

    if current_chunk:  # Add the last chunk if it exists
        chunks.append(current_chunk.strip())

    return chunks

# Step 15: Split podcast script into chunks and save
def split_and_save_chunks():
    script_file_path = Path(base_dir) / "podcast_script.txt"

    # Read the content from the podcast script file
    with open(script_file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Split the content into chunks of at most 4096 characters
    max_chunk_length = 4096
    text_chunks = split_text_into_chunks(content, max_chunk_length)

    # Write each chunk to a new numbered file
    for i, chunk in enumerate(text_chunks):
        chunk_file_path = Path(base_dir) / f"chunk_{i + 1}.txt"
        with open(chunk_file_path, 'w', encoding='utf-8') as chunk_file:
            chunk_file.write(chunk)
        print(f"Written: {chunk_file_path}")

    print("Text splitting completed successfully.")

# Step 16: Convert podcast script chunks to speech and save as audio
def convert_chunks_to_speech_and_combine():
    script_file_path = Path(base_dir) / "podcast_script.txt"

    # Read the content from the podcast script file
    with open(script_file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Split the content into chunks of at most 4096 characters
    max_chunk_length = 4096
    text_chunks = split_text_into_chunks(content, max_chunk_length)

    # Create a directory for audio files
    audio_dir = Path(base_dir) / "audio_chunks"
    audio_dir.mkdir(exist_ok=True)

    audio_files = []
    
    # Convert each chunk to speech and save the audio
    url = "https://api.openai.com/v1/audio/speech"

    for i, chunk in enumerate(text_chunks):
        headers = {
            "Authorization": f"Bearer {openai_api_key}",
            "Content-Type": "application/json",
        }
        data = {
            "model": "tts-1",
            "voice": "alloy",
            "input": chunk,
        }

        # Make the POST request to generate speech
        response = requests.post(url, headers=headers, json=data)

        # Save the audio response as an MP3 file
        if response.status_code == 200:
            audio_file_path = audio_dir / f"chunk_{i + 1}.mp3"
            with open(audio_file_path, "wb") as audio_file:
                audio_file.write(response.content)
            audio_files.append(audio_file_path)
            print(f"Written: {audio_file_path}")
        else:
            print(f"Error for chunk {i + 1}: {response.status_code} - {response.text}")

    # Combine all audio files into one
    combined_audio = AudioSegment.empty()
    for audio_file in audio_files:
        audio_segment = AudioSegment.from_mp3(audio_file)
        combined_audio += audio_segment

    # Export the combined audio
    combined_audio_file_path = Path(base_dir) / "combined_audio.mp3"
    combined_audio.export(combined_audio_file_path, format="mp3")
    print(f"Combined audio saved as: {combined_audio_file_path}")

# Step 17: Setup the directory structure based on query and timestamp
def setup_directories(query):
    global base_dir, html_dir, text_dir, output_dir, summaries_dir

    # Create the directory name from query and timestamp
    timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
    base_dir = Path(f"{query}_{timestamp}")
    base_dir.mkdir(exist_ok=True)

    # Create subdirectories
    html_dir = base_dir / 'html_files'
    text_dir = base_dir / 'html_text'
    output_dir = base_dir / 'news_text'
    summaries_dir = base_dir / 'summaries'

    for dir_name in [html_dir, text_dir, output_dir, summaries_dir]:
        Path(dir_name).mkdir(exist_ok=True)

# Step 18: Main process
def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Fetch news articles from NewsAPI.')
    parser.add_argument('query', type=str, help='Search query')
    parser.add_argument('from_date', type=str, help='Start date for fetching articles (YYYY-MM-DD)')
    parser.add_argument('--num_articles', type=int, default=10, help='Number of articles to fetch')

    args = parser.parse_args()

    query = args.query
    from_date = args.from_date
    num_articles = args.num_articles
    
    # Ensure the API keys are loaded
    if not news_api_key or not openai_api_key:
        print("API keys not found. Please ensure they are set in the .env file.")
        return

    # Setup directories based on the query and timestamp
    setup_directories(query)

    # Fetch articles
    articles_data = fetch_articles(query, from_date, news_api_key, num_articles)
    
    if articles_data:
        json_file_path = Path(base_dir) / f"articles_{query}.json"
        with open(json_file_path, 'w') as json_file:
            json.dump(articles_data, json_file, indent=4)
        print(f"Articles saved to {json_file_path}")

        # Download articles as HTML files
        download_html_articles(articles_data)

        # Convert HTML to text
        print("Converting HTML to text...")
        convert_html_to_text()

        # Check relevance and move files
        check_relevance_and_move_files(query)

        # Generate summaries for relevant articles
        create_summaries()

        # Aggregate summaries for podcast script
        aggregated_summaries = aggregate_summaries()

        if aggregated_summaries:
            # Generate podcast script based on aggregated summaries
            podcast_script = generate_podcast_script(aggregated_summaries, query)
            
            if podcast_script:
                # Save the podcast script to a file
                save_podcast_script(podcast_script)
                
                # Summarize the podcast script
                summarize_podcast_script(podcast_script)
                
                # Briefly summarize the podcast script
                
                small_summarize_podcast_script(podcast_script)

                # Split the podcast script into chunks and save them
                split_and_save_chunks()

                # Convert podcast script to speech
                convert_chunks_to_speech_and_combine()
            else:
                print("Failed to generate podcast script.")
        else:
            print("No summaries found to aggregate.")

# Step 18: Run the main function
if __name__ == "__main__":
    main()