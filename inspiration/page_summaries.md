# Page Summaries

## GenAI_Lecture_10_17
### Page 1: Advanced Generative AI: GANs, Autoencoders, and Transformers
- Topics 10-17: A Comprehensive Guide
- Manipal University Jaipur
- February 12, 2026

### Page 2: Course Overview
- 1 Generative Adversarial Networks (GANs)
- GAN Architecture
- GAN Training Process
- Variants of GANs

### Page 3: What is Generative AI?
- Generative AIcreates new content that
- resembles training data
- Types:
- Text generation

### Page 4: Introduction to GANs
- What are GANs?
- Generative Adversarial Networks(GANs) are a class of machine learning frameworks
- designed by Ian Goodfellow in 2014.
- Core Concept:

### Page 5: GAN Architecture: The Big Picture
- Generator
- G(z)
- Random Noisez
- Fake Samples

### Page 6: The Generator Network
- Purpose:Create fake samples that look real
- Input:Random noise vectorz∼p z(z)
- Usually Gaussian or Uniform distribution
- Low-dimensional (e.g., 100-dimensional)

### Page 7: The Discriminator Network
- Purpose:Distinguish real from fake samples
- Input:Either real dataxor generated dataG(z)
- Architecture:
- Convolutional layers (for images)

### Page 8: How Does GAN Work? - Step by Step
- 1 Initialization:
- Initialize GeneratorGand DiscriminatorDwith random weights
- 2 Generate Fake Samples:
- Sample random noise:z∼p z(z)

### Page 9: The GAN Training Process
- Algorithm 1GAN Training Algorithm
- 1:fornumber of training iterationsdo
- 2:fork stepsdo
- 3:Sample minibatch ofmnoise samples{z (1), ...,z (m)}fromp z(z)

### Page 10: GAN Objective Function
- Minimax Game
- The complete objective function for GANs:
- min
- G

### Page 11: Training Challenges
- 1. Mode Collapse
- Generator produces limited variety
- All outputs look similar
- Fails to capture full data distribution

### Page 12: Variants of GANs: Overview
- Variant Key Innovation
- DCGAN Deep Convolutional architecture, stable
- training
- CGAN Conditional generation with class labels

### Page 13: DCGAN - Deep Convolutional GAN
- Key Contributions (2015):
- Replace pooling with strided convolutions
- Use batch normalization
- Remove fully connected hidden layers

### Page 14: CGAN - Conditional GAN
- Idea:Guide generation with additional
- information
- Conditioning Variablesy:
- Class labels (digit 0-9)

### Page 15: WGAN - Wasserstein GAN
- Problem with Original GAN:
- JS divergence can saturate
- Vanishing gradients
- Mode collapse

### Page 16: StyleGAN
- Innovation:Style-based generator architecture
- Key Features:
- Mapping networkf:Z → W
- Adaptive instance normalization (AdaIN)

### Page 17: CycleGAN and Pix2Pix
- Pix2Pix (Paired):
- Requires paired training data
- Input-output correspondence
- U-Net generator architecture

### Page 18: Introduction to Autoencoders
- What is an Autoencoder?
- AnAutoencoderis an unsupervised neural network that learns efficient data representations
- (encodings) by training the network to reconstruct its input.
- Core Idea:

### Page 19: Autoencoder Architecture
- Input
- x∈R n
- Encoder
- fθ(x)

### Page 20: Applications of Autoencoders
- 1. Dimensionality Reduction
- Compress high-dimensional data
- Non-linear alternative to PCA
- Feature extraction

### Page 21: Variants of Autoencoders
- Type Key Characteristics
- Vanilla AE Basic encoder-decoder, reconstruction loss
- Sparse AE Sparsity constraint on hidden activations
- Denoising AE Trained to reconstruct from corrupted input

### Page 22: Sparse Autoencoder
- Motivation:
- Prevent learning identity function
- Encourage sparse representations
- Learn more meaningful features

### Page 23: Denoising Autoencoder (DAE)
- Key Idea:
- Add noise to input: ˜x=x+ϵ
- Train to reconstruct cleanxfrom ˜x
- Learn robust features

### Page 24: Variational Autoencoder (VAE)
- Key Difference from AE:
- Probabilistic framework
- Encoder outputs distribution parameters
- Can generate new samples

### Page 25: Convolutional Autoencoder
- For Image Data:
- Exploit spatial structure
- Translation invariance
- Parameter sharing

### Page 26: Training Process for Autoencoders
- Step-by-Step Training:
- 1 Initialize:
- Random weights for encoder and decoder
- Choose architecture (FC, Conv, etc.)

### Page 27: Loss Functions for Autoencoders
- 1. Mean Squared Error (MSE):
- LMSE = 1
- n
- nX

### Page 28: Training Tips and Best Practices
- Hyperparameters:
- Learning rate: 0.001 - 0.0001
- Batch size: 32 - 256
- Latent dimension: depends on data

### Page 29: Introduction to Transformers
- What are Transformers?
- Transformersare a neural network architecture introduced in ”Attention is All You Need”
- (Vaswani et al., 2017) that relies entirely on attention mechanisms, dispensing with recurrence
- and convolutions.

### Page 30: Transformer Architecture Overview
- Input
- Embedding
- Encoder
- Multi-Head Attention

### Page 31: Detailed Transformer Architecture
- Input Processing:
- 1 Token Embedding:Convert tokens to vectors (d model dimension)
- 2 Positional Encoding:Add position information (since no recurrence)
- Encoder Block (repeated N times):

### Page 32: Positional Encoding
- Problem:
- Transformers have no recurrence
- No inherent sequence order
- Need to inject position info

### Page 33: What is Attention?
- Core Idea
- Attentionallows the model to focus on different parts of the input when producing each part
- of the output, weighting their importance dynamically.
- Intuition:

### Page 34: Scaled Dot-Product Attention
- Attention Formula
- Attention(Q,K,V) = softmax
-  QK T
- √dk

### Page 35: Multi-Head Attention
- Motivation:
- Single attention focuses on one aspect
- Multiple heads capture different
- relationships

### Page 36: Self-Attention vs Cross-Attention
- Self-Attention:
- Q, K, V from same sequence
- Relate positions within sequence
- Used in both encoder and decoder

### Page 37: Attention Visualization
- How Attention Works - Example
- Input Sentence:”The cat sat on the mat”
- Query Keys (Attention Weights)
- The cat sat on the mat

### Page 38: GANs vs Autoencoders vs Transformers
- Aspect GANs Autoencoders Transformers
- Purpose Generate realistic
- data
- Compress and recon-

### Page 39: Key Takeaways - GANs
- 1 Architecture:
- Generator creates fake data from noise
- Discriminator distinguishes real from fake
- Adversarial training process

### Page 40: Key Takeaways - Autoencoders
- 1 Core Concept:
- Unsupervised learning of compressed representations
- Encoder maps to latent space
- Decoder reconstructs from latent code

### Page 41: Key Takeaways - Transformers
- 1 Innovation:
- Attention is all you need
- No recurrence or convolution
- Parallel processing of sequences

### Page 42: Modern Applications and Future
- GANs:
- Deepfakes and synthetic media
- Medical image synthesis
- Drug discovery

### Page 43: Practice Questions
- GANs:
- 1 What is the main difference between Generator and Discriminator?
- 2 Explain the minimax objective function in GANs
- 3 How does WGAN improve upon vanilla GAN?

### Page 44: Resources and Further Reading
- Key Papers:
- GANs: Goodfellow et al., 2014
- DCGAN: Radford et al., 2015
- VAE: Kingma & Welling, 2013

### Page 45: Thank You!
- QUESTIONS?


## GenAI_Lecture_1_3
### Page 1: GENERATIVE AI AND LARGE LANGUAGE MODELS
- Code: DSE3261
- Manipal university Jaipur
- January 11, 2026

### Page 2: 1: CONCEPT OF AI, INTRODUCTION TO
- GENERATIVE AI

### Page 3: What is Artificial Intelligence?
- Artificial Intelligence (AI) refers to the simulation of human intelligence processes by computer
- systems. These processes include:
- Learning:Acquiring information and rules from data
- Reasoning:Using rules to reach logical or approximate conclusions

### Page 4: Core Domains of Artificial Intelligence
- Major AI Domains
- 1 Machine Learning (ML)
- Algorithms that improve through experience
- Supervised, unsupervised, and reinforcement learning

### Page 5: Key Milestones in AI Development
- Historical Evolution
- 1950s – Birth of AI
- Alan Turing proposes the Turing Test (1950)
- Dartmouth Conference coins the term AI (1956)

### Page 6: Challenges in Rule-Based AI Systems
- Rule-Based Systems
- Traditional AI systems rely on explicitly programmed IF–THEN rules.
- 1 Scalability Issues
- Exponential growth of rules

### Page 7: Challenges in Traditional Machine Learning Systems
- Limitations of Classical ML
- Feature Engineering Dependency
- Manual feature extraction
- Requires domain expertise

### Page 8: Introduction to Generative AI
- What is Generative AI?
- Generative AI refers to systems that can create new, original content such as text, images,
- audio, video, code, and data.
- Core Principle

### Page 9: AI vs Generative AI: Conceptual Difference
- Traditional AI
- Predicts or classifies data
- Learns decision boundaries
- ModelsP(Y|X)

### Page 10: Generative AI Applications Across Industries
- Healthcare:Drug discovery, medical imaging, diagnosis
- Content & Media:Text, image, video, music generation
- Software Development:Code generation, debugging
- Education:Personalized learning, virtual tutors

### Page 11: Generative AI Applications Across Industries
- Healthcare:Drug discovery, medical imaging, diagnosis
- Content & Media:Text, image, video, music generation
- Software Development:Code generation, debugging
- Education:Personalized learning, virtual tutors

### Page 12: Summary: Introduction to AI and Generative AI
- Key Takeaways
- AI simulates human intelligence through learning and reasoning
- Evolution from rule-based systems to deep learning
- Generative AI represents a paradigm shift toward creation

### Page 13: 2: HISTORY AND EVOLUTION OF AI
- AND GENERATIVE AI

### Page 14: The Genesis of Artificial Intelligence (1940s–1950s)
- Pre-AI Era: Theoretical Foundations
- 1943 – McCulloch–Pitts Neuron
- First mathematical model of artificial
- neurons

### Page 15: Birth and First Golden Age of AI (1956–1974)
- 1956 – Dartmouth Conference
- Organized by John McCarthy, Marvin
- Minsky, Claude Shannon
- TermArtificial Intelligencecoined

### Page 16: The First AI Winter (1974–1980)
- Causes of the First AI Winter
- 1 Computational Limitations
- Limited memory and processing power
- Exponential search complexity

### Page 17: Expert Systems and the AI Renaissance (1980–1987)
- What Are Expert Systems?
- Knowledge-based systems emulating human experts
- IF–THEN rules with inference engines
- Explanation facilities for transparency

### Page 18: The Second AI Winter (1987–1993)
- Triggers of the Second Collapse
- 1 AI Hardware Market Collapse
- LISP machines outcompeted by PCs
- AI hardware companies failed

### Page 19: What Kept AI Alive During the AI Winter
- 1. Niche Successes
- Expert systems continued to provide
- value
- Military and aerospace applications

### Page 20: Rise of Machine Learning (1993–2010)
- Paradigm Shift: From Logic to Statistics
- Why Statistical Approaches Emerged
- Knowledge engineering bottleneck in
- expert systems

### Page 21: Major Machine Learning Breakthroughs
- Neural Networks Renaissance
- Backpropagation (1986)
- Rumelhart, Hinton, Williams
- Enabled training deep networks

### Page 22: Success Stories of Machine Learning
- Probabilistic Graphical Models
- Bayesian Networks
- Hidden Markov Models
- Markov Chain Monte Carlo

### Page 23: The Deep Learning Revolution (2010–2020)
- The Perfect Storm: Why Deep Learning Succeeded
- Big Data Era
- ImageNet (2009): 14M labeled images
- Web-scale text corpora

### Page 24: Deep Learning Breakthroughs
- AlexNet (2012)
- 8-layer CNN, 60M parameters
- Won ImageNet by huge margin
- Used GPUs, ReLU, dropout

### Page 25: Deep Learning in Games and Industry
- Game-Playing Breakthroughs
- AlphaGo (2016): defeated Lee Sedol
- AlphaZero (2017): learned from self-play
- OpenAI Five (2018): mastered Dota 2

### Page 26: Birth and Rise of Generative AI (2014–2020)
- Why Generative Models Matter
- Move beyond prediction to creation
- Learn full data distributions
- Enable synthetic data generation

### Page 27: Generative Adversarial Networks (GANs)
- GAN Architecture
- Random noise→Generator→Fake
- image
- Real images→Discriminator

### Page 28: Other Generative Model Families
- Variational Autoencoders (2013)
- Encoder→latent space→decoder
- Probabilistic generative model
- Smooth interpolation

### Page 29: From Research to Generative AI Era
- Early Language Models
- GPT-1 (2018): Generative Transformer
- BERT (2018): Bidirectional
- understanding

### Page 30: The Generative AI Explosion (2020–Present)
- GPT-3 and the Scale Revolution
- GPT-3 (June 2020)
- 175B parameters (100×GPT-2)
- Trained on 45TB text

### Page 31: Image Generation Takes Off
- DALL-E + CLIP (2021)
- Text→Image
- 400M image-text pairs (CLIP)
- Enabled zero-shot vision

### Page 32: ChatGPT and the LLM Explosion
- ChatGPT (Nov 2022)
- GPT-3.5 + RLHF
- Free public access
- 100M users in 2 months

### Page 33: Multimodal Generative AI
- Audio & Music
- MusicLM, Riffusion
- ElevenLabs voice cloning
- Vall-E TTS

### Page 34: Summary: History and Evolution of AI
- Cycles of AI
- 1956–74: Optimism
- 1974–80: AI Winter
- 1980s: Expert systems

### Page 35: 3: DEEP LEARNING ARCHITECTURES VS
- TRANSFORMER ARCHITECTURES

### Page 36: Introduction to Neural Network Architectures
- What is a Neural Network Architecture?
- Structural design of interconnected
- neurons
- Defines how data flows and is processed

### Page 37: Multi-Layer Perceptrons (MLPs)
- What is an MLP?
- Fully connected feedforward network
- Layered structure
- Uses nonlinear activations

### Page 38: Convolutional Neural Networks (CNNs)
- Core Idea
- Local connectivity
- Weight sharing
- Hierarchical feature learning

### Page 39: Recurrent Neural Networks (RNNs)
- What is an RNN?
- Designed for sequences
- Uses hidden state memory
- Processes data step-by-step

### Page 40: LSTM and GRU
- Why LSTM?
- Solves vanishing gradient
- Has memory cell
- Uses gates to control flow

### Page 41: Introduction to Transformer Architecture
- The Paradigm Shift: “Attention is All You Need” (Vaswani et al., 2017)
- What Problem Did Transformers Solve?
- RNN/LSTM Limitations
- Sequential processing (no parallelization)

### Page 42: Transformer Architecture Overview
- Input Tokens
- Embeddings + Positional Encoding
- Encoder Stack
- (Self-Attention + FFN)

### Page 43: Self-Attention: The Core Innovation
- IdeaEach token attends to all others to
- compute its representation.
- Intuition
- “Which words matter for me?”

### Page 44: Self-Attention Visualization
- The animal it0.45
- 0.12
- 0.15
- ““it” attends mostly to “animal” – correct coreference.

### Page 45: Multi-Head Attention
- Why Multiple Heads?
- Syntax, semantics, coreference, position
- One head cannot capture all
- Multiple heads specialize

### Page 46: Multi-Head Attention Flow
- Input
- Head 1 Head 2 Head 3
- Concatenate
- LinearW O

### Page 47: Single vs Multi-Head Attention
- Aspect Single Head Multi-Head
- Perspectives 1 Many
- Expressiveness Limited High
- Specialization No Yes

### Page 48: Feed-Forward Networks and Layer Components
- Beyond Attention:
- Attention mixes information across tokens
- Feed-Forward Networks (FFN) transform each token individually
- Adds non-linearity and model capacity

### Page 49: Transformer Layer Structure
- Input
- LayerNorm
- Multi-Head Attention
- Residual Add

### Page 50: Transformer Building Blocks and Architectures
- Core Training Stabilizers
- Layer Normalization
- LN(x) =γ x−µ
- σ +β

### Page 51: Transformer Architectures (Part 1)
- Encoder–Decoder (Original Transformer)
- Two stacks: Encoder + Decoder
- Encoder: bidirectional self-attention
- Decoder: autoregressive generation

### Page 52: Transformer Architectures (Part 2)
- Decoder-Only (GPT-style)
- Usescausal self-attention
- Each token sees only past tokens
- Trained with next-token prediction:

### Page 53: Training Objectives and Alignment
- Core Training Objectives
- 1. Autoregressive (GPT)
- L=−
- X

### Page 54: Training Infrastructure and Scaling
- Training at Scale
- GPT-3
- 10,000 GPUs
- 300B tokens

### Page 55: Thank You
- The End


## GenAI_Lecture_4
### Page 1: Lecture 4: Foundation Models and Popular Generative
- AI Models
- January 28, 2026

### Page 2: Lecture Outline
- 1 Introduction to Foundation Models
- 2 Popular Generative AI Models

### Page 3: What are Foundation Models?
- Definition
- Foundation models are large-scale AI models trained on broad data at
- scale, designed to be adapted to a wide range of downstream tasks.
- Key Characteristics:

### Page 4: Evolution: From Task-Specific to Foundation Models
- Task 1
- Model 1
- Task 2
- Model 2

### Page 5: Foundation Models: Training Paradigm
- Training Pipeline:
- 1 Pre-training Phase
- Unsupervised/self-supervised learning
- Massive corpus (web text, books, code, etc.)

### Page 6: Foundation Models: Capabilities
- Emergent Abilities:
- Few-shot learning
- Zero-shot generalization
- Chain-of-thought reasoning

### Page 7: Foundation Models: Architecture Components
- Core Components:
- Embedding Layer:Converts input tokens to dense vectors
- Transformer Blocks:Self-attention and feed-forward layers
- Positional Encoding:Captures sequence order information

### Page 8: Foundation Models vs Traditional ML
- Aspect Traditional ML Foundation Models
- Training Data Task-specific, labeled Broad, mostly unlabeled
- Model Scope Single task Multi-task capable
- Adaptation Train from scratch Fine-tune or prompt

### Page 9: Taxonomy of Generative AI Models
- Generative AI
- Text
- GPT BERT
- Image

### Page 10: GPT Family (OpenAI)
- Generative Pre-trained Transformer
- GPT-1 (2018):117M parameters, proof of concept
- GPT-2 (2019):1.5B parameters, text generation breakthrough
- GPT-3 (2020):175B parameters, few-shot learning

### Page 11: BERT Family (Google)
- Bidirectional Encoder Representations from Transformers
- BERT-Base:110M parameters, 12 layers
- BERT-Large:340M parameters, 24 layers
- RoBERTa:Robustly optimized BERT

### Page 12: T5 and FLAN-T5 (Google)
- Text-to-Text Transfer Transformer
- Unified Framework
- All NLP tasks reformulated as text-to-text: input text→output text
- Variants:

### Page 13: LLaMA Family (Meta)
- Large Language Model Meta AI
- LLaMA (2023):7B, 13B, 33B, 65B variants
- LLaMA 2 (2023):7B, 13B, 70B with commercial license
- LLaMA 3 (2024):Enhanced multilingual, 8B and 70B

### Page 14: Claude Family (Anthropic)
- Constitutional AI Approach
- Claude 1:Initial release with safety focus
- Claude 2:Extended context (100K tokens)
- Claude 3:Family - Haiku, Sonnet, Opus variants

### Page 15: PaLM and Gemini (Google)
- PaLM (Pathways Language Model):
- 540B parameters
- Pathways architecture for efficient scaling
- State-of-the-art reasoning capabilities

### Page 16: Image Generation Models
- Diffusion Models:Stable Diffusion
- Open-source
- Latent diffusion
- Text-to-image

### Page 17: Multimodal Models
- CLIP (OpenAI):
- Contrastive Language-Image Pre-training
- Learns visual concepts from text
- Zero-shot image classification

### Page 18: Code Generation Models
- GitHub Copilot (OpenAI Codex):
- Based on GPT architecture
- Trained on public code repositories
- IDE integration (VS Code, etc.)

### Page 19: Audio and Speech Models
- Whisper (OpenAI):
- Automatic speech recognition (ASR)
- Multilingual (99 languages)
- Robust to accents and noise

### Page 20: Model Comparison Matrix
- Model Org Modality Access Strength
- GPT-4 OpenAI Text, Vision API Reasoning
- Claude 3 Anthropic Text API Safety, Analysis
- Gemini Ultra Google Multimodal API Integration

### Page 21: Open Source vs Closed Source
- Open Source:
- + Transparency
- + Customization
- + No API costs

### Page 22: Emerging Trends in Foundation Models
- Recent Developments:
- 1 Mixture of Experts (MoE):
- Sparse activation for efficiency
- Examples: GPT-4, Mixtral

### Page 23: Challenges in Foundation Models
- Technical Challenges:
- Computational cost and energy consumption
- Hallucination and factual accuracy
- Bias and fairness issues


## GenAI_Lecture_5
### Page 1: Lecture 5: Generative AI Landscape and Ecosystem
- February 1, 2026

### Page 2: Lecture Outline
- 1 GenAI Workflow
- 2 GenAI Ecosystem

### Page 3: End-to-End GenAI Workflow
- Data Collection & Preparation
- Pre-training
- Fine-tuning
- Evaluation

### Page 4: End-to-End Generative AI Workflow
- Data Collection
- Web, books, code, images
- Pre-training
- Learn language & world patterns

### Page 5: Stage 1: Data Collection and Preparation
- Data Sources:
- Public Web:Common Crawl, Wikipedia, Reddit
- Books:Project Gutenberg, Books3
- Code:GitHub, Stack Overflow

### Page 6: Data Quality and Curation
- Quality Dimensions:
- Aspect Considerations
- Accuracy Factual correctness, citations
- Relevance Domain alignment, task fit

### Page 7: Stage 2: Pre-training
- Self-Supervised Learning Objectives:
- Causal Language Modeling (CLM):
- Predict next token given previous tokens
- Used in: GPT, LLaMA, PaLM

### Page 8: Pre-training Infrastructure
- Computational Requirements:
- Hardware:TPUs, GPUs (A100, H100)
- Scale:Thousands of accelerators
- Duration:Weeks to months

### Page 9: Stage 3: Fine-tuning Approaches
- Fine-tuning Spectrum:
- 1 Full Fine-tuning:
- Update all model parameters
- Maximum adaptation

### Page 10: Instruction Fine-tuning
- Process:
- Goal
- Teach model to follow natural language instructions
- Dataset Format:

### Page 11: Alignment: RLHF
- Reinforcement Learning from Human Feedback
- 1 Supervised Fine-tuning (SFT):
- Train on high-quality demonstrations
- 2 Reward Model Training:

### Page 12: Stage 4: Evaluation
- Evaluation Dimensions:Automatic Metrics:
- Perplexity
- BLEU, ROUGE
- BERTScore

### Page 13: Stage 5: Deployment Strategies
- Deployment Options:
- 1 Cloud API:
- OpenAI API, Anthropic API, Google Cloud
- Pay-per-token pricing

### Page 14: Model Optimization for Deployment
- Efficiency Techniques:
- Quantization:
- INT8, INT4, binary weights
- Reduces memory and compute

### Page 15: Stage 6: Monitoring and Iteration
- Production Monitoring:
- Performance Metrics:
- Latency, throughput, uptime
- Token usage and costs

### Page 16: Stage 6: Monitoring and Iteration
- Production Monitoring:
- Performance Metrics:
- Latency, throughput, uptime
- Token usage and costs

### Page 17: The GenAI Ecosystem Layers
- Applications Layer
- Development Tools & Frameworks
- Model APIs & Services
- Foundation Models

### Page 18: Layer 1: Infrastructure and Compute
- Hardware Providers:
- NVIDIA:GPU dominance (A100, H100, GH200)
- Google:TPU (Tensor Processing Units)
- AMD:MI300 series

### Page 19: Layer 2: Foundation Models
- Model Providers:
- Provider Models Access Focus
- OpenAI GPT-4, GPT-3.5 API General purpose
- Anthropic Claude 3 family API Safety, analysis

### Page 20: Layer 3: Model APIs and Services
- API Platforms:
- Direct Provider APIs:
- OpenAI API, Anthropic API, Google AI
- Native features, latest models

### Page 21: Specialized Services
- Embedding Services:
- OpenAI Embeddings, Cohere Embed
- Sentence Transformers
- Vector representation for semantic search

### Page 22: Layer 4: Development Tools and Frameworks
- Application Frameworks:
- LangChain:
- Orchestration framework
- Chains, agents, memory

### Page 23: Vector Databases
- Purpose:Store and retrieve embeddings efficiently
- Database Type Key Feature
- Pinecone Managed Fully managed, scalable
- Weaviate Open-source GraphQL, hybrid search

### Page 24: MLOps and LLMOps Tools
- Training & Experimentation:
- Hugging Face Transformers, Accelerate
- DeepSpeed, Megatron-LM (Microsoft/NVIDIA)
- PyTorch, JAX, TensorFlow

### Page 25: Prompt Engineering Tools
- Prompt Management:
- PromptBase:Marketplace for prompts
- PromptPerfect:Optimization tool
- AI Dungeon:Interactive prompt testing

### Page 26: Layer 5: Applications
- Categories:
- Productivity:
- ChatGPT, Claude
- Notion AI

### Page 27: Enterprise Applications
- Business Functions:
- Customer Service:
- Intelligent chatbots
- Automated ticket routing

### Page 28: Key Ecosystem Players
- Major Technology Companies:
- OpenAI:Leading model provider, ChatGPT
- Google/DeepMind:Research powerhouse, Gemini
- Microsoft:Azure OpenAI, Copilot integration

### Page 29: Ecosystem Trends
- Current Trends:
- 1 Democratization:
- More open-source models
- Easier deployment tools

### Page 30: Business Models in GenAI
- Revenue Streams:
- API Access:
- Pay-per-token pricing
- Subscription tiers

### Page 31: Challenges in the Ecosystem
- Technical Challenges:
- Compute costs and accessibility
- Model evaluation and benchmarking
- Interoperability standards

### Page 32: The Future Ecosystem
- Emerging Patterns:
- 1 Commoditization of Base Models:
- More open-source alternatives
- Price pressure on API providers

### Page 33: Key Takeaways:
- 1 GenAI workflow spans data collection to deployment monitoring
- 2 The ecosystem is layered: Infrastructure→Models→APIs→Tools
- →Applications
- 3 Rapid innovation across all layers


## GenAI_Lecture_7
### Page 1: Lecture 7: Large Language Models and Comparison of
- SLMs and LLMs
- February 10, 2026

### Page 2: Lecture Outline
- 1 Large Language Models (LLMs)
- 2 Comparison of SLMs and LLMs

### Page 3: What are Large Language Models (LLMs)?
- Definition
- Large Language Models are neural networks with billions to trillions of
- parameters, trained on massive text corpora, capable of understanding and
- generating human-like text with remarkable fluency and knowledge.

### Page 4: The Scaling Hypothesis
- Core Principle:Model performance improves predictably with scale (data,
- parameters, compute)
- Scaling Laws (Kaplan et al., 2020):
- L(N)≈

### Page 5: Evolution of LLM Scale
- Historical Growth:
- Model Year Parameters Organization
- GPT-1 2018 117M OpenAI
- BERT-Large 2018 340M Google

### Page 6: Architecture of Modern LLMs
- Transformer-Based Architecture:
- Input Layer:
- Token embeddings (vocabulary size×embedding dim)
- Positional encodings

### Page 7: Training Large Language Models
- Training Process:
- 1 Data Collection:
- Web crawl (Common Crawl)
- Books, academic papers, code

### Page 8: Distributed Training Techniques
- Parallelism Strategies:
- 1 Data Parallelism:
- Replicate model across devices
- Split data batches

### Page 9: Emergent Abilities of LLMs
- Emergence
- Abilities that appear suddenly at certain scales, not present in smaller
- models, and not explicitly trained for.
- Key Emergent Abilities:

### Page 10: In-Context Learning
- Concept:LLMs learn to perform new tasks from examples provided in the
- prompt, without parameter updates
- Learning Paradigms:
- Zero-Shot:

### Page 11: Prompt Engineering for LLMs
- Definition:The art and science of crafting effective prompts to elicit
- desired responses from LLMs
- Key Techniques:
- 1 Clear Instructions:

### Page 12: Prompt Engineering for LLMs
- Definition:The art and science of crafting effective prompts to elicit
- desired responses from LLMs
- Key Techniques:
- 1 Clear Instructions:

### Page 13: Prompt Engineering for LLMs
- Definition:The art and science of crafting effective prompts to elicit
- desired responses from LLMs
- Key Techniques:
- 1 Clear Instructions:

### Page 14: Capabilities of Modern LLMs
- Demonstrated Capabilities:
- Language Tasks:
- Translation
- Summarization

### Page 15: Limitations of LLMs
- Key Limitations:
- 1 Hallucinations:
- Generate plausible but false information
- Confident incorrect responses

### Page 16: LLM Challenges and Risks
- Technical Challenges:
- Computational cost ($millions for training)
- Energy consumption and environmental impact
- Inference latency and cost

### Page 17: SLMs vs LLMs - Size and Scale
- Comparative Overview:
- Aspect SLMs LLMs
- Parameters ¡ 1B 10B - 1000B+
- Training Data 10B - 100B tokens 300B - 2T+ tokens

### Page 18: SLMs vs LLMs - Capabilities
- Capability Comparison:
- Capability SLMs LLMs
- Task Performance Good for specific
- tasks

### Page 19: SLMs vs LLMs - Deployment
- Deployment Characteristics:
- Small Language Models:
- + Edge deployment
- + Mobile devices

### Page 20: SLMs vs LLMs - Cost Analysis
- Total Cost of Ownership:
- Cost Factor SLMs LLMs
- Training$1K -$100K$1M -$100M
- Infrastructure Minimal Significant

### Page 21: SLMs vs LLMs - Use Case Selection
- When to Choose SLMs:
- Edge/mobile deployment required
- Real-time, low-latency needs
- Privacy-sensitive applications

### Page 22: Hybrid Approaches
- Combining SLMs and LLMs:
- 1 Cascading Models:
- SLM for initial filtering/routing
- LLM for complex queries only

### Page 23: Future Trends - Convergence
- Emerging Trends:
- 1 Efficient Large Models:
- Mixture of Experts (MoE)
- Sparse activation

### Page 24: Environmental Considerations
- Carbon Footprint Comparison:
- Model Type Training CO2 (tons) Inference/1M queries
- Small (100M) 0.01 - 0.1 Negligible
- Medium (1B) 0.1 - 1 Low

### Page 25: Decision Framework
- Model Selection Criteria:
- Requirements
- Deployment? Task Complexity?
- SLM Hybrid Hybrid LLM

### Page 26: Key Takeaways:
- 1 LLMs are 10B+ parameter models with emergent capabilities
- 2 Scaling laws show predictable improvements with size
- 3 LLMs exhibit few-shot learning, reasoning, broad knowledge
- 4 SLMs offer efficiency, deployability, privacy


## GenAI_Lecture_8
### Page 1: Lecture 8: Popular LLM Architectures
- February 10, 2026

### Page 2: Lecture Outline
- 1 Overview of LLM Architectures
- 2 Decoder-Only Architectures
- 3 Encoder-Only Architectures
- 4 Encoder-Decoder Architectures

### Page 3: Taxonomy of LLM Architectures
- Three Main Architectural Families:
- 1 Encoder-Only (BERT-style):
- Bidirectional attention
- Understanding-focused

### Page 4: Architecture Comparison
- Encoder-Only
- Encoder
- Bidirectional
- Decoder-Only

### Page 5: GPT Family - Overview
- Generative Pre-trained Transformer (OpenAI)
- Core Principles:
- Decoder-only transformer architecture
- Autoregressive language modeling

### Page 6: GPT Evolution Timeline
- Model Progression:
- Model Year Params Layers Context
- GPT-1 2018 117M 12 512
- GPT-2 2019 1.5B 48 1024

### Page 7: GPT Architecture Details
- Architecture Components:
- 1 Token + Position Embeddings:
- Vocabulary: 50,257 tokens (GPT-3)
- Learned positional embeddings

### Page 8: LLaMA Family - Overview
- Large Language Model Meta AI
- Design Philosophy:
- Open-source foundation models
- Efficient training on publicly available data

### Page 9: LLaMA Architecture Innovations
- Key Technical Improvements:
- 1 Pre-normalization (RMSNorm):
- Normalize inputs to each transformer sub-layer
- Improves training stability

### Page 10: PaLM - Pathways Language Model
- Google’s Efficient Large-Scale Model
- Key Specifications:
- Parameters:540 billion
- Architecture:Decoder-only transformer

### Page 11: PaLM 2 - Improvements
- Second Generation (2023)
- Key Enhancements:
- 1 Improved Training:
- Compute-optimal scaling

### Page 12: Claude - Constitutional AI
- Anthropic’s Safety-Focused LLM
- Constitutional AI Approach:
- 1 Supervised Learning Phase:
- Initial training on helpful responses

### Page 13: Claude Model Family
- Claude 3 Variants (2024):
- Model Size Class Context Use Case
- Claude 3 Haiku Small 200K Fast, efficient
- Claude 3 Sonnet Medium 200K Balanced

### Page 14: Mistral AI Models
- Efficient Open-Source LLMs
- Mistral 7B:
- 7.3B parameters
- Outperforms LLaMA 2 13B

### Page 15: Mixture of Experts (MoE)
- Architecture Concept:
- Multiple ”expert” sub-networks
- Router network selects which experts to use
- Only subset of experts active per token

### Page 16: Encoder-Only: BERT
- Bidirectional Encoder Representations from Transformers
- Key Innovations:
- Bidirectional Context:Sees both left and right context
- Masked Language Modeling (MLM):Predict masked tokens

### Page 17: BERT Variants
- Improved Versions:
- 1 RoBERTa (Robustly Optimized BERT):
- Remove NSP objective
- Dynamic masking

### Page 18: Encoder-Decoder: T5
- Text-to-Text Transfer Transformer
- Unified Framework:
- Core Idea
- Convert all NLP tasks to text-to-text format

### Page 19: T5 and FLAN-T5
- T5 Variants:
- Model Parameters Use Case
- T5-Small 60M Experimentation
- T5-Base 220M General tasks

### Page 20: Gemini - Multimodal Architecture
- Google’s Natively Multimodal LLM
- Model Family:
- Gemini Nano:1.8B - 3.25B parameters, on-device
- Gemini Pro:Medium size, API access

### Page 21: Architecture Comparison Summary
- Model Architecture Size Key Innovation Best For
- GPT-4 Decoder-only 1.7T MoE, Multimodal General purpose
- LLaMA 3 Decoder-only 8B-405B RoPE, GQA Open source
- Claude 3 Decoder-only Multiple Constitutional AI Safety, analysis

### Page 22: Attention Mechanism Variants
- Evolution of Attention:
- 1 Multi-Head Attention (Original):
- Separate Q, K, V for each head
- Memory:O(n·h·d)

### Page 23: Position Encoding Methods
- Encoding Positional Information:
- 1 Absolute Sinusoidal (Original Transformer):
- Fixed sine/cosine functions
- PE(pos,2i) = sin(pos/10000 2i/d )

### Page 24: Key Takeaways:
- 1 Three main architectures: Encoder-only, Decoder-only,
- Encoder-Decoder
- 2 Decoder-only dominates modern LLMs (GPT, LLaMA, PaLM,
- Claude)


## GenAI_Lecture_9
### Page 1: Lecture 9: Introduction to Generative Adversarial
- Networks (GANs)
- February 10, 2026

### Page 2: Lecture Outline
- 1 Introduction to GANs
- 2 GAN Variants
- 3 GAN Applications

### Page 3: What are Generative Adversarial Networks?
- Definition
- Generative Adversarial Networks (GANs) are a class of generative models
- consisting of two neural networks—a generator and a discriminator—that
- compete against each other in a zero-sum game framework.

### Page 4: GAN Architecture
- z
- Random Noise
- GeneratorG
- Fake Real

### Page 5: GAN Training Process
- Adversarial Game:
- 1 Train Discriminator:
- Show real data, label as ”real” (1)
- Generate fake data from G, label as ”fake” (0)

### Page 6: GAN Objective Function
- Minimax Game:
- min
- G
- max

### Page 7: Training Dynamics
- Convergence to Equilibrium:
- Training Iterations
- Quality
- Generator

### Page 8: GAN Training Challenges
- Common Training Issues:
- 1 Mode Collapse:
- Generator produces limited variety
- Fails to capture full data distribution

### Page 9: Addressing Training Challenges
- Solutions and Techniques:
- 1 Architecture Improvements:
- Deep Convolutional GANs (DCGAN)
- Batch normalization

### Page 10: DCGAN - Deep Convolutional GAN
- Architecture Guidelines (Radford et al., 2015):
- 1 Replace pooling layers:
- Use strided convolutions (discriminator)
- Use fractional-strided convolutions (generator)

### Page 11: Conditional GAN (cGAN)
- Controlled Generation:
- Concept
- Condition both generator and discriminator on additional information
- (labels, attributes, etc.)

### Page 12: Wasserstein GAN (WGAN)
- Improved Training Stability
- Key Innovation:Use Wasserstein distance (Earth Mover’s Distance)
- instead of JS divergence
- Objective:

### Page 13: Progressive GAN
- High-Resolution Image Generation
- Training Strategy:
- 1 Start with low resolution (4×4)
- 2 Train until stable

### Page 14: StyleGAN
- Style-Based Generator Architecture
- Key Innovations:
- 1 Mapping Network:
- Maps latent codezto intermediate latent spacew

### Page 15: CycleGAN
- Unpaired Image-to-Image Translation
- Problem:Learn mapping between two domains without paired examples
- Architecture:
- Two generators:G:X→YandF:Y→X

### Page 16: Paired Image-to-Image Translation
- Problem:Learn mapping from input image to output image with paired
- training data
- Architecture:
- Generator:U-Net architecture

### Page 17: Large Scale GAN Training
- Scaling Up (DeepMind, 2018):
- Larger batch sizes (256-2048)
- More parameters (70M-160M)
- Higher resolution (128×128, 256×256, 512×512)

### Page 18: GAN Applications
- Diverse Use Cases:Computer Vision:
- Image generation
- Super-resolution
- Image inpainting

### Page 19: Image Generation Applications
- Practical Use Cases:
- 1 PhotoRealistic Face Generation:
- StyleGAN, This Person Does Not Exist
- Character design, avatars

### Page 20: GANs vs Other Generative Models
- Comparison with Alternatives:
- Model Advantages Disadvantages Best For
- GANs Sharp images, fast sampling Training instability, mode col-
- lapse

### Page 21: Evaluation Metrics for GANs
- Quantitative Metrics:
- 1 Inception Score (IS):
- Measures quality and diversity
- Uses pre-trained Inception network

### Page 22: Limitations and Ethical Concerns
- Technical Limitations:
- Training instability and convergence issues
- Mode collapse
- Difficult to control outputs precisely

### Page 23: GANs vs Diffusion Models
- The Rise of Diffusion Models:
- Why Diffusion Models are Gaining:
- Training Stability:More stable than GANs
- Mode Coverage:Less mode collapse

### Page 24: Key Takeaways:
- 1 GANs use adversarial training: Generator vs Discriminator
- 2 Training challenges: mode collapse, instability, evaluation
- 3 Major variants: DCGAN, cGAN, WGAN, StyleGAN, CycleGAN
- 4 Applications: image generation, translation, enhancement, creative

