import re
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

def extract_video_id(url: str) -> str:
    """
    Extracts the YouTube video ID from various forms of YouTube URLs.
    """
    # Regex patterns for different YouTube URL formats
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
            
    raise ValueError("Invalid YouTube URL")

def extract_text_from_youtube(url: str) -> str:
    """
    Fetches the transcript for a given YouTube URL and returns it as a single string.
    """
    try:
        video_id = extract_video_id(url)
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.list(video_id)
        
        # Try to find English or Hindi, or just fallback to the first available
        try:
            transcript_obj = transcript_list.find_transcript(['en', 'en-US', 'en-GB', 'hi', 'hi-IN'])
        except Exception:
            # Fallback to the first available transcript
            transcript_obj = next(iter(transcript_list))
            
        transcript_data = transcript_obj.fetch()
        
        # Format the transcript into a single text block
        formatter = TextFormatter()
        text_formatted = formatter.format_transcript(transcript_data)
        
        return text_formatted
    except StopIteration:
        raise Exception("No transcripts available for this video.")
    except Exception as e:
        raise Exception(f"Failed to fetch YouTube transcript: {str(e)}")
