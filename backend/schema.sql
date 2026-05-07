-- Users (handled mostly by Supabase Auth, but we can extend if needed)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects / Workspaces
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    study_data_url TEXT, -- Link to the generated JSON in Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploaded Documents (Raw files)
CREATE TABLE public.uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Supabase Storage URL
    extracted_text TEXT, -- Optional: raw text if we want to store it in DB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Focus Sessions (Flow Mode analytics)
CREATE TABLE public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    subject_id UUID REFERENCES public.subjects(id),
    duration_minutes INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow users to read/write only their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view own subjects" ON public.subjects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subjects" ON public.subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subjects" ON public.subjects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subjects" ON public.subjects FOR DELETE USING (auth.uid() = user_id);

-- Note: In Supabase, you also need to set up a trigger to auto-create a profile when a new user signs up.
