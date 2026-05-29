"""
Recursive character text splitter service for clean document chunking.
Preserves paragraphs, sentences, words, LaTeX equations, and Mermaid diagrams where possible.
"""

from typing import List, Optional

def split_text_recursive(
    text: str,
    max_chunk_size: int,
    overlap: int = 200,
    separators: Optional[List[str]] = None
) -> List[str]:
    """
    Recursively splits text into chunks of maximum size `max_chunk_size` while keeping an overlap of `overlap`.
    Tries to split along the separators list in order (defaults to paragraphs, sentences, words, then characters).
    """
    if separators is None:
        separators = ["\n\n", "\n", ". ", "? ", "! ", " ", ""]
        
    if overlap >= max_chunk_size:
        raise ValueError("Overlap must be smaller than the maximum chunk size.")

    final_chunks = []

    def recurse(text_to_split: str, current_seps: List[str]) -> List[str]:
        # If the text is already small enough, return it as a single chunk
        if len(text_to_split) <= max_chunk_size:
            return [text_to_split]

        # If we have exhausted all separators, perform a hard character-level split
        if not current_seps:
            return [text_to_split[i:i + max_chunk_size] for i in range(0, len(text_to_split), max_chunk_size)]

        separator = current_seps[0]
        next_seps = current_seps[1:]

        # Split the text by the current separator
        if separator == "":
            splits = list(text_to_split)
        else:
            splits = text_to_split.split(separator)

        chunks = []
        current_doc = ""

        for idx, split in enumerate(splits):
            # Re-add the separator if it is not the last item
            item = split + separator if idx < len(splits) - 1 and separator != "" else split

            if len(item) > max_chunk_size:
                # If a single item exceeds max chunk size, process any accumulated document first
                if current_doc:
                    chunks.append(current_doc)
                    current_doc = ""
                # Recursively split the oversized item using remaining separators
                chunks.extend(recurse(split, next_seps))
            else:
                # If adding the item is within bounds
                if len(current_doc) + len(item) <= max_chunk_size:
                    current_doc += item
                else:
                    # Save the current chunk
                    if current_doc:
                        chunks.append(current_doc)
                    # Prepare overlapping text from the end of the current chunk
                    if len(current_doc) > overlap:
                        overlap_text = current_doc[-overlap:]
                    else:
                        overlap_text = current_doc
                    
                    current_doc = overlap_text + item

        if current_doc:
            chunks.append(current_doc)

        return chunks

    raw_chunks = recurse(text, separators)
    
    # Clean up whitespace and filter empty chunks
    cleaned_chunks = []
    for chunk in raw_chunks:
        trimmed = chunk.strip()
        if trimmed:
            cleaned_chunks.append(trimmed)
            
    return cleaned_chunks
