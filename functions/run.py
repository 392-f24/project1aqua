import subprocess

# Step 1: Rename variables here
query = "Music"
from_date = "2024-10-10"
num_articles = 16  # Specify the number of articles to fetch

# Step 2: Run the news fetching script
script_name = "podgen.py"  # Change this to your actual script filename

# Step 3: Use subprocess to run the command with the specified arguments
subprocess.run(["python", script_name, query, from_date, "--num_articles", str(num_articles)])
