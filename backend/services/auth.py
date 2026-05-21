from fastapi import Header, HTTPException, status
from services.supabase_client import supabase

async def get_current_user(authorization: str = Header(...)):
    """
    FastAPI dependency to extract and validate the Supabase JWT.
    Ensures the token is valid, creates/upserts the profile to prevent
    foreign key issues, and returns the authenticated user object.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Must start with 'Bearer '"
        )
    
    token = authorization.split(" ")[1]
    try:
        # Validate JWT by calling Supabase Auth server using the token
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session token"
            )
        
        user = user_response.user
        
        # Self-healing profile check: Ensure user exists in profiles table
        # to prevent downstream database foreign key errors.
        try:
            supabase.table("profiles").upsert({
                "id": user.id,
                "email": user.email,
            }).execute()
        except Exception as profile_err:
            print(f"Non-blocking profile upsert issue: {profile_err}")
            
        return user
        
    except Exception as e:
        print(f"Authentication failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )
