import os
import sys
import firebase_admin
from firebase_admin import credentials, storage

# Path to the service account key (relative to the root directory)
SERVICE_ACCOUNT_KEY = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')

# Initialize Firebase Admin SDK
cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'flashbrief-e6852.appspot.com'  # Your Firebase storage bucket
})

def upload_file_to_firebase(local_path, firebase_path):
    """Upload a single file to Firebase Storage."""
    bucket = storage.bucket()  # Get the storage bucket
    blob = bucket.blob(firebase_path)  # Define the Firebase path

    try:
        with open(local_path, 'rb') as f:
            blob.upload_from_file(f)
        print(f"Uploaded {firebase_path} to gs://{bucket.name}/{firebase_path}")
    except Exception as e:
        print(f"Error uploading {local_path}: {e}")

def main(directory):
    """Upload only 'combined_audio.mp3' and 'summary.txt' from the given directory."""
    # File names to upload
    files_to_upload = ['combined_audio.mp3', 'summary.txt']

    # Extract the base directory name to use as the Firebase directory
    base_dir_name = os.path.basename(os.path.normpath(directory))

    for filename in files_to_upload:
        local_file_path = os.path.join(directory, filename)
        firebase_file_path = f"{base_dir_name}/{filename}"  # Save under the Firebase directory

        if os.path.isfile(local_file_path):
            print(f"Found {local_file_path}, uploading...")
            upload_file_to_firebase(local_file_path, firebase_file_path)
        else:
            print(f"Error: {filename} not found in {directory}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upload.py <directory>")
        sys.exit(1)

    directory_to_upload = sys.argv[1]

    if os.path.isdir(directory_to_upload):
        main(directory_to_upload)
    else:
        print(f"Error: {directory_to_upload} is not a valid directory.")
        sys.exit(1)
