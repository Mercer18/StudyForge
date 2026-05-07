# Generative AI Combined Notes

Source coverage:
- `GenAI_Lecture_1_3.pdf`
- `GenAI_Lecture_4.pdf`
- `GenAI_Lecture_5.pdf`
- `GenAI_Lecture_7.pdf`
- `GenAI_Lecture_8.pdf`
- `GenAI_Lecture_9.pdf`
- `GenAI_Lecture_10_17.pdf`

Gaps and cleanup:
- `Lecture 6` was not provided, so these notes are comprehensive for the files you gave, not for the full course sequence.
- `Lecture 9` and `Lecture 10_17` overlap on GANs. The notes below merge that overlap instead of repeating it.

## 1. Concept Of AI And Introduction To Generative AI

### What is Artificial Intelligence?
- AI is the simulation of human intelligence by machines.
- Core AI abilities:
  - learning from data
  - reasoning and decision-making
  - problem solving
  - perception
  - language understanding

### Core domains of AI
- `Machine Learning`
  - systems improve through experience
  - includes supervised, unsupervised, and reinforcement learning
- `Natural Language Processing`
  - lets systems process and generate human language
- `Computer Vision`
  - lets systems interpret images and videos
- `Robotics`
  - combines perception, planning, and action
- `Knowledge Representation and Reasoning`
  - encodes facts/rules and uses inference

### Key milestones in AI
- `1950`: Alan Turing proposes the Turing Test.
- `1956`: Dartmouth Conference popularizes the term Artificial Intelligence.
- Early AI focused on symbolic reasoning and logic-based systems.
- Later waves shifted toward machine learning, deep learning, and now generative AI.

### Problems with rule-based AI
- Requires large numbers of explicit `IF-THEN` rules.
- Does not scale well as domain complexity increases.
- Hard to maintain and update.
- Brittle when facing ambiguous or unseen cases.

### Problems with traditional machine learning
- Heavy dependence on manual feature engineering.
- Performance depends strongly on domain expertise and data preprocessing.
- Usually optimized for prediction or classification, not creation.
- Often struggles with unstructured multimodal data without complex pipelines.

### What is Generative AI?
- Generative AI creates new content that resembles the data it was trained on.
- Common output types:
  - text
  - images
  - audio
  - video
  - code
  - synthetic data

### Traditional AI vs Generative AI
| Aspect | Traditional AI | Generative AI |
|---|---|---|
| Main goal | predict, classify, optimize | create new content |
| Typical formulation | model `P(Y|X)` | model data distribution such as `P(X)` or next-token distributions |
| Output | labels, scores, decisions | text, images, code, media |
| Typical value | automation of decisions | automation of creation |

### Generative AI applications
- `Healthcare`
  - drug discovery
  - medical imaging support
  - diagnosis assistance
- `Content and Media`
  - article generation
  - image/video generation
  - music generation
- `Software`
  - code generation
  - documentation
  - debugging assistance
- `Education`
  - tutoring
  - personalized learning
  - content generation
- `Business`
  - chatbots
  - report drafting
  - workflow automation

### Core takeaway
- AI evolved from rule-based reasoning to data-driven learning.
- Generative AI marks a shift from recognizing patterns to producing new content from learned patterns.

## 2. History And Evolution Of AI And Generative AI

### 1940s to 1950s: theoretical foundations
- McCulloch-Pitts neuron introduced a mathematical model of neurons.
- Early computation theory laid the foundation for machine intelligence.
- Turing’s work shaped the idea of machine reasoning.

### 1956 to 1974: first golden age of AI
- Dartmouth Conference launched AI as a formal field.
- Researchers expected symbolic reasoning to solve intelligence quickly.
- Progress happened in search, planning, theorem proving, and early NLP.

### 1974 to 1980: first AI winter
- Computing hardware was too weak.
- Search spaces exploded combinatorially.
- Early systems could not meet the hype.
- Funding and confidence dropped.

### 1980 to 1987: expert systems era
- Knowledge-based systems became commercially useful.
- Expert systems used rule engines to imitate human specialists.
- Strength:
  - worked well in narrow, structured domains
- Weakness:
  - knowledge engineering bottleneck
  - hard to scale and maintain

### 1987 to 1993: second AI winter
- AI hardware market collapsed.
- Expert systems were expensive and fragile.
- Hype again exceeded practical results.

### What kept AI alive during the winters
- niche industrial deployments
- military and aerospace use cases
- statistical learning research
- neural network work that later resurfaced

### 1993 to 2010: rise of machine learning
- Shift from hand-coded rules to statistical methods.
- Major methods and success areas:
  - Bayesian networks
  - hidden Markov models
  - support vector machines
  - ensemble methods
- Backpropagation made multi-layer neural network training more viable.

### 2010 to 2020: deep learning revolution
- Success drivers:
  - big datasets
  - GPUs
  - improved optimization methods
  - better architectures
- Landmark examples:
  - `AlexNet (2012)` for vision
  - deep RL/game systems like AlphaGo
  - large neural speech/NLP systems

### 2014 to 2020: birth of modern generative AI
- Generative models moved from theory to practical systems.
- Important model families:
  - GANs
  - Variational Autoencoders
  - early transformer language models
- Core shift:
  - from understanding data to learning full data distributions and generating samples

### 2020 to present: generative AI explosion
- `GPT-3` showed scale-driven capability jumps.
- `DALL-E`, `CLIP`, and related systems pushed text-to-image generation.
- `ChatGPT` popularized conversational LLMs.
- Multimodal models combined text, image, speech, and code.

### Big historical pattern
- AI history is cyclical:
  - optimism
  - overpromising
  - limitations
  - winter
  - new technical breakthrough
- Current GenAI boom is built on:
  - transformers
  - large-scale data
  - huge compute
  - better alignment techniques

## 3. Deep Learning Architectures Vs Transformer Architectures

### Neural network architectures
- A neural architecture defines:
  - how neurons/layers are arranged
  - how information flows
  - what inductive bias the model has

### Multi-Layer Perceptrons (MLPs)
- Fully connected feed-forward networks.
- Good for tabular and basic representation learning.
- Limitations:
  - parameter-heavy
  - weak at exploiting spatial or sequential structure

### Convolutional Neural Networks (CNNs)
- Designed for grid-like data such as images.
- Core ideas:
  - local connectivity
  - weight sharing
  - hierarchical feature extraction
- Strong for:
  - image classification
  - detection
  - segmentation

### Recurrent Neural Networks (RNNs)
- Designed for sequential data.
- Maintain hidden state over time.
- Problem:
  - hard to train over long sequences
  - vanishing/exploding gradients

### LSTM and GRU
- Gated RNN variants created to preserve information longer.
- Better than vanilla RNNs on long dependencies.
- Still limited by sequential computation and poor parallelism.

### Why transformers changed the game
- Introduced in `Attention Is All You Need` (2017).
- Removed dependence on recurrence and convolutions for sequence modeling.
- Main benefit:
  - all tokens can interact through attention
  - much better parallel training

### Transformer architecture overview
- Input tokens are converted to embeddings.
- Positional information is added because the architecture itself has no sense of order.
- Core block contains:
  - multi-head self-attention
  - feed-forward network
  - residual connections
  - layer normalization

### Self-attention
- Each token builds a representation by attending to other relevant tokens.
- Each token is projected into:
  - `Q` query
  - `K` key
  - `V` value
- Attention tells the model which words matter for the current token.

### Scaled dot-product attention
- Basic formula:
  - `Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V`
- Meaning:
  - compare query against keys
  - normalize into weights
  - use weights to combine value vectors

### Multi-head attention
- Uses several attention heads in parallel.
- Each head can capture a different relation:
  - syntax
  - semantics
  - positional dependence
  - coreference
- Better than single-head attention because one head is too limited.

### Feed-forward network in transformer blocks
- Attention mixes information across tokens.
- The feed-forward network transforms each token representation independently.
- Adds non-linearity and capacity.

### Common transformer architectural patterns
- `Encoder-only`
  - bidirectional
  - strong for understanding tasks
  - example: BERT
- `Decoder-only`
  - causal masking
  - strong for text generation
  - example: GPT
- `Encoder-decoder`
  - separate encoder and decoder stacks
  - strong for seq2seq tasks like translation
  - example: T5

### Training objectives and alignment
- `Autoregressive next-token prediction`
  - used by GPT-like models
- `Masked language modeling`
  - used by BERT-like models
- `Sequence-to-sequence objectives`
  - used by T5-like models
- Later alignment layers include:
  - instruction tuning
  - RLHF
  - safety tuning

### Infrastructure and scaling
- Transformer success depends heavily on large-scale training:
  - massive corpora
  - distributed GPU/TPU systems
  - long training runs

### Bottom line
- MLPs, CNNs, and RNNs are still important.
- Transformers dominate modern language and many multimodal tasks because they scale better and model long-range relationships more effectively.

## 4. Foundation Models And Popular Generative AI Models

### What are foundation models?
- Large-scale pre-trained models trained on broad data.
- They act as reusable bases for many downstream tasks.
- Instead of training a fresh model per task, we adapt or prompt one large model.

### Main characteristics
- trained on diverse large datasets
- mostly self-supervised or unsupervised pre-training
- transferable across tasks
- adaptable by prompting, fine-tuning, or instruction tuning
- often built on transformer stacks

### Shift from task-specific models to foundation models
- Old approach:
  - one model for one task
- New approach:
  - one broad model reused across many tasks
- This reduces repeated training effort and enables emergent cross-task behavior.

### Training paradigm
- `Pre-training`
  - learns general representations from massive corpora
- `Adaptation`
  - fine-tuning, prompting, or instruction tuning for specific tasks

### Capabilities
- zero-shot generalization
- few-shot learning
- in-context learning
- broad knowledge recall
- reasoning patterns that emerge with scale

### Foundation models vs traditional ML
| Aspect | Traditional ML | Foundation Models |
|---|---|---|
| Data | task-specific labeled data | broad mostly unlabeled data |
| Scope | narrow | multi-task |
| Training | usually from scratch per task | pre-train once, adapt later |
| Adaptation | retrain or redesign | prompt, fine-tune, or align |

### Taxonomy of generative AI models
- `Text models`
  - GPT family
  - BERT family
  - T5 family
  - LLaMA family
  - Claude family
  - PaLM/Gemini
- `Image models`
  - diffusion models
  - GAN-based systems
- `Multimodal models`
  - joint text-image or multimodal reasoning systems
- `Code models`
  - code completion and generation models
- `Audio/Speech models`
  - ASR, TTS, voice synthesis, audio generation

### Popular model families from the lecture

#### GPT family
- Decoder-only transformer.
- Major line:
  - `GPT-1`: proof of concept
  - `GPT-2`: strong text generation jump
  - `GPT-3`: large few-shot gains
- Best known for:
  - generative language tasks
  - chat and reasoning-oriented prompting

#### BERT family
- Encoder-only, bidirectional transformer.
- Built mainly for understanding rather than open-ended generation.
- Key ideas:
  - masked language modeling
  - strong contextual representations
- Variants include RoBERTa and others.

#### T5 / FLAN-T5
- Encoder-decoder architecture.
- Reformulates tasks into a text-to-text format.
- Useful because a single framework handles summarization, translation, QA, etc.

#### LLaMA family
- Meta’s open-weight/opener ecosystem line.
- Known for efficient training and strong open-source adoption.
- Lecture mentions LLaMA, LLaMA 2, and LLaMA 3.

#### Claude family
- Anthropic’s safety-focused model line.
- Built around constitutional AI ideas.
- Strong association with long context and analysis-oriented usage.

#### PaLM and Gemini
- Google family.
- PaLM emphasized very large decoder-only scaling.
- Gemini emphasized native multimodality and broader integration.

#### Image generation models
- Lecture highlights diffusion models such as Stable Diffusion.
- Common strengths:
  - high-quality text-to-image generation
  - open-source ecosystems

#### Multimodal models
- Can process more than one modality.
- Example lecture references include CLIP-style text-image learning and Gemini-like multimodal systems.

#### Code generation models
- Models trained on source code support:
  - autocomplete
  - code synthesis
  - debugging help
  - IDE integration

#### Audio and speech models
- Speech recognition, speech generation, and multilingual transcription are major application areas.

### Open source vs closed source
- `Open source/open weights`
  - more transparency
  - better customization
  - lower vendor lock-in
- `Closed source/API`
  - usually easier access
  - often stronger hosted infrastructure/safety layers
  - ongoing token/API costs

### Emerging trends in foundation models
- Mixture of Experts for efficiency
- multimodality
- larger context windows
- smaller efficient models for edge devices
- stronger alignment and safety tuning

### Challenges
- huge compute and energy cost
- hallucination
- bias and fairness issues
- safety and misuse
- evaluation difficulty

## 5. Generative AI Landscape And Ecosystem

### End-to-end GenAI workflow
1. Data collection and preparation
2. Pre-training
3. Fine-tuning/alignment
4. Evaluation
5. Deployment
6. Monitoring and iteration

### Stage 1: data collection and preparation
- Typical sources:
  - web corpora
  - books
  - code repositories
  - images/audio/video depending on modality
- Key concerns:
  - quality
  - relevance
  - diversity
  - duplicates
  - toxic or copyrighted material
- Bad data poisons the full pipeline. This is one of the biggest hidden resource sinks in GenAI systems.

### Data quality and curation
- Dimensions emphasized by the lecture:
  - accuracy
  - relevance
  - consistency
  - diversity
  - cleanliness
- Curation matters because scale without filtering amplifies noise, bias, and legal risk.

### Stage 2: pre-training
- Uses self-supervised objectives.
- Examples:
  - causal language modeling for GPT-like models
  - masked modeling for BERT-like models
- Goal:
  - learn broad patterns of language/world structure from huge corpora

### Pre-training infrastructure
- Requires large GPU/TPU clusters.
- Often needs:
  - thousands of accelerators
  - distributed storage
  - high-bandwidth interconnects
  - weeks to months of training time

### Stage 3: fine-tuning approaches
- `Full fine-tuning`
  - all parameters updated
  - high adaptation quality
  - expensive
- `Parameter-efficient fine-tuning`
  - LoRA/adapters-like methods
  - cheaper and easier to maintain
- `Instruction fine-tuning`
  - teaches models to follow natural-language instructions
- `Alignment with RLHF`
  - moves outputs toward human preferences

### RLHF
- Typical pipeline:
  1. supervised fine-tuning on high-quality demonstrations
  2. reward model training from preference data
  3. reinforcement learning optimization using the reward signal
- Purpose:
  - make outputs more helpful, safe, and aligned

### Stage 4: evaluation
- Automatic metrics mentioned:
  - perplexity
  - BLEU
  - ROUGE
  - BERTScore
- Real evaluation also needs:
  - human judgment
  - robustness checks
  - safety testing
  - task-specific benchmarking

### Stage 5: deployment strategies
- `Cloud API`
  - easy to integrate
  - pay-per-token economics
- `Self-hosted/open models`
  - more control
  - more infra burden
- `On-device/edge`
  - possible mainly with smaller models

### Model optimization for deployment
- quantization
- pruning
- distillation
- batching/caching
- efficient serving frameworks

### Stage 6: monitoring and iteration
- Track:
  - latency
  - throughput
  - uptime
  - cost/token usage
  - user quality metrics
  - safety incidents
- Production GenAI is not a one-shot deployment. Monitoring is part of the product.

### The GenAI ecosystem layers
1. Infrastructure and compute
2. Foundation models
3. APIs and model services
4. Development frameworks and LLMOps tools
5. Applications

### Layer 1: infrastructure and compute
- Hardware vendors:
  - NVIDIA
  - Google TPU
  - AMD
- Infra layer controls the economics of training and serving.

### Layer 2: foundation models
- Providers build the base models that power downstream products.
- Examples from lecture:
  - OpenAI
  - Anthropic
  - Google
  - Meta/open-source ecosystem

### Layer 3: APIs and specialized services
- Direct model APIs expose inference capabilities.
- Specialized services include:
  - embedding APIs
  - moderation/safety APIs
  - speech services
  - retrieval services

### Layer 4: development tools and frameworks
- orchestration frameworks
- model libraries
- training frameworks
- prompt tooling
- evaluation tooling
- observability and LLMOps stacks

### Vector databases
- Purpose:
  - store embeddings
  - enable semantic search and retrieval
- Important for:
  - RAG systems
  - document search
  - memory-like application features

### Layer 5: applications
- end-user chatbots
- copilots
- enterprise knowledge tools
- content generation tools
- automation assistants
- vertical AI applications

### Key ecosystem trends
- more open models
- commoditization pressure on base model APIs
- increased need for retrieval and orchestration tools
- growth of on-device and efficient models
- stronger demand for LLMOps, governance, and evaluation

### Business models
- pay-per-token APIs
- subscriptions
- enterprise licensing
- custom model services
- tool/platform ecosystem revenue

### Ecosystem challenges
- compute concentration
- interoperability problems
- benchmarking and evaluation gaps
- regulation/compliance pressure
- uncertain moats as models commoditize

## 6. Large Language Models (LLMs) And SLMs Vs LLMs

### What are LLMs?
- Large neural language models trained on massive text corpora.
- Usually transformer-based.
- Capable of understanding and generating fluent text across many tasks.

### Scaling hypothesis
- Performance tends to improve with more:
  - parameters
  - data
  - compute
- Scaling laws suggest predictable gains, though not infinite or free.

### Evolution of LLM scale
- Language models grew from millions of parameters to billions and beyond.
- Growth in context length, training tokens, and multimodal capability happened alongside parameter scaling.

### Architecture of modern LLMs
- token embeddings
- positional encoding
- stacked transformer blocks
- causal self-attention for generation
- feed-forward layers
- normalization and residual pathways

### Training LLMs
- Data comes from web, books, code, and other large text corpora.
- Training requires:
  - distributed optimization
  - large batches
  - data/model/pipeline parallelism
  - extensive compute budgets

### Distributed training techniques
- `Data parallelism`
  - split batches across devices
- `Model parallelism`
  - split model across devices
- `Pipeline parallelism`
  - split layers across devices and stagger microbatches

### Emergent abilities
- Some abilities appear only after sufficient scale.
- Examples discussed in LLM lectures:
  - few-shot adaptation
  - better reasoning behavior
  - broad task transfer
- Important caution:
  - emergence does not mean guaranteed reliability

### In-context learning
- The model performs a new task from prompt examples without weight updates.
- Common modes:
  - zero-shot
  - one-shot
  - few-shot

### Prompt engineering
- A prompt strongly shapes output quality.
- Useful tactics:
  - clear instruction
  - context/background
  - examples
  - output format constraints
  - role/task framing
- Prompting is cheaper than retraining, but weaker than proper system design when task complexity rises.

### Capabilities of modern LLMs
- summarization
- translation
- question answering
- code generation
- classification/extraction
- dialogue
- reasoning-like behavior
- tool use and workflow orchestration in larger systems

### Limitations
- hallucinations
- confident false answers
- bias and unsafe outputs
- weak factual grounding without retrieval
- context-window and latency constraints
- sensitive behavior under prompt phrasing changes

### Risks and challenges
- training cost
- inference cost
- environmental impact
- misuse for spam, fraud, and deception
- privacy leakage
- evaluation complexity

### SLMs vs LLMs
| Aspect | SLMs | LLMs |
|---|---|---|
| Size | small to sub-billion/low-billion scale | typically 10B+ in lecture framing |
| Cost | much lower | much higher |
| Latency | lower | higher |
| Deployment | edge/mobile/private environments possible | usually server/cloud heavy |
| Capability breadth | narrower | broader and stronger generalization |
| Privacy control | easier when local | harder with external APIs |

### When SLMs make sense
- edge or mobile deployment
- strict latency requirements
- privacy-sensitive use cases
- limited budget
- narrow domain-specific tasks

### When LLMs make sense
- complex reasoning or long-form generation
- broad domain coverage
- stronger few-shot performance
- higher-quality assistant or copilot behavior

### Hybrid approaches
- route easy queries to an SLM
- escalate hard queries to an LLM
- use SLMs for filtering/classification and LLMs for deep generation

### Environmental considerations
- bigger models create bigger training and inference footprints.
- Model choice is not just about accuracy. It is also about compute, cost, and sustainability.

### Decision framework
- Ask:
  - how hard is the task?
  - what latency is acceptable?
  - is private/local deployment required?
  - what budget exists?
  - how much quality margin is needed?

## 7. Popular LLM Architectures

### Three major architecture families

#### Encoder-only
- Bidirectional attention.
- Best for understanding/representation tasks.
- Example:
  - BERT

#### Decoder-only
- Autoregressive generation with causal masking.
- Best for text generation and chat.
- Examples:
  - GPT
  - LLaMA
  - PaLM
  - Claude
  - Mistral

#### Encoder-decoder
- Encoder reads input; decoder generates output.
- Best for text-to-text tasks.
- Example:
  - T5

### GPT family
- Decoder-only transformer.
- Optimized for next-token prediction.
- Strong fit for:
  - generation
  - chat
  - completion
  - few-shot prompting

### GPT architecture details
- token and positional embeddings
- stacked masked self-attention blocks
- feed-forward layers
- training objective: autoregressive next-token prediction

### LLaMA family
- Open model family focused on efficient strong performance.
- Lecture highlights practical innovations such as efficient normalization and attention improvements.

### LLaMA architecture innovations
- `RMSNorm` / pre-normalization for stability
- efficient training on public data
- modern position methods like `RoPE`
- grouped-query attention in later variants

### PaLM
- Very large Google decoder-only model.
- Stressed efficient large-scale training and reasoning gains from scale.

### PaLM 2
- Improved training efficiency and compute-optimal behavior.
- Better multilingual and task adaptation characteristics than earlier versions.

### Claude and Constitutional AI
- Safety-oriented decoder-only family.
- Constitutional AI uses explicit principles to guide output shaping and self-critique-style alignment behavior.

### Mistral
- Efficient open models with strong performance relative to size.
- Important because they show that architecture/training quality can beat naive scaling.

### Mixture of Experts (MoE)
- Multiple expert subnetworks exist.
- A router activates only some experts for each token.
- Benefit:
  - high effective capacity
  - lower per-token compute than activating the whole network
- Tradeoff:
  - more system complexity

### BERT
- Encoder-only.
- Strong for classification, retrieval, and language understanding.
- Key innovation:
  - bidirectional context with masked language modeling

### BERT variants
- `RoBERTa`
  - improved training recipe
  - removed NSP
  - dynamic masking
- other derived variants usually target speed, domain adaptation, or multilinguality

### T5
- Encoder-decoder model.
- Converts all tasks into text-to-text format.
- Very clean abstraction for multiple NLP tasks under one setup.

### FLAN-T5
- Instruction-tuned T5 variant.
- Better task following due to instruction-based tuning.

### Gemini
- Lecture frames Gemini as a natively multimodal family.
- Includes versions for:
  - on-device
  - medium API usage
  - larger multimodal reasoning

### Attention mechanism variants
- multi-head attention
- grouped-query attention
- multi-query attention
- sparse/efficient attention variants
- These variants mostly trade off quality, speed, and memory use.

### Position encoding methods
- absolute positional encoding
- learned positional embeddings
- rotary positional embeddings (`RoPE`)
- relative position methods

### High-level comparison
- Decoder-only models dominate open-ended generation.
- Encoder-only models dominate representation-heavy understanding tasks.
- Encoder-decoder models remain excellent for structured transformation tasks.

## 8. Generative Adversarial Networks (GANs)

### What is a GAN?
- A GAN consists of two networks trained in opposition:
  - `Generator (G)` creates fake samples from random noise
  - `Discriminator (D)` tries to distinguish real samples from generated samples
- This creates an adversarial game.

### Core intuition
- The generator tries to fool the discriminator.
- The discriminator tries not to be fooled.
- If training succeeds, generated samples become increasingly realistic.

### GAN architecture
- Input to generator:
  - random latent vector `z`
- Generator output:
  - fake sample `G(z)`
- Discriminator input:
  - real sample `x` or fake sample `G(z)`
- Discriminator output:
  - probability that input is real

### GAN training process
1. Sample real data.
2. Sample noise vectors.
3. Generate fake samples.
4. Train discriminator on real vs fake.
5. Train generator to improve its ability to fool discriminator.
6. Repeat until equilibrium or acceptable sample quality.

### GAN objective function
- Original GAN uses a minimax objective:
  - `min_G max_D V(D, G) = E[log D(x)] + E[log(1 - D(G(z)))]`
- Meaning:
  - discriminator maximizes correct real/fake classification
  - generator minimizes discriminator success on fake data

### Training dynamics
- GAN optimization is not simple loss minimization on one network.
- It is a game between two objectives.
- Stable convergence is hard.

### Major training challenges
- `Mode collapse`
  - generator produces limited variety
- `Vanishing gradients`
  - discriminator becomes too strong
- `Instability/non-convergence`
  - oscillating behavior
- `Evaluation difficulty`
  - good-looking samples do not guarantee full distribution coverage

### Techniques to address GAN instability
- architecture improvements such as DCGAN
- batch normalization
- careful learning-rate balancing
- alternative losses such as Wasserstein loss
- progressive training

### GAN variants

#### DCGAN
- Replaced pooling with strided convolutions.
- Used batch normalization.
- Made image GAN training more stable and practical.

#### Conditional GAN (cGAN)
- Conditions both G and D on extra information like labels or attributes.
- Enables controlled generation.

#### Wasserstein GAN (WGAN)
- Replaces JS-divergence-style training behavior with Wasserstein distance.
- Improves gradient quality and training stability.

#### Progressive GAN
- Starts from low resolution and gradually increases resolution.
- Useful for high-resolution image synthesis.

#### StyleGAN
- Style-based generator architecture.
- Uses mapping network and style control mechanisms.
- Excellent for photorealistic face/image generation.

#### CycleGAN
- Learns unpaired image-to-image translation between two domains.
- Example:
  - horses to zebras without paired examples

#### Pix2Pix / paired image translation
- Uses paired training examples.
- Often built with U-Net-like generators.
- Suitable when aligned input-output pairs exist.

### Large-scale GAN training
- Uses bigger models, batches, and higher resolutions.
- Goal:
  - improve sample realism and diversity
- Cost:
  - training gets compute-heavy fast

### GAN applications
- image synthesis
- super-resolution
- inpainting
- style transfer
- domain translation
- avatar/face generation
- data augmentation
- medical imaging

### GANs vs other generative models
| Model | Strength | Weakness | Best fit |
|---|---|---|---|
| GAN | sharp samples, fast generation | unstable training, mode collapse | realistic image synthesis |
| VAE | stable training, structured latent space | blurrier outputs | representation learning, interpolation |
| Transformer | great for sequences and scale | expensive for dense image generation without tricks | language, multimodal, sequence tasks |

### Evaluation metrics
- `Inception Score (IS)`
  - captures quality/diversity indirectly
- `FID`
  - compares generated and real feature distributions
- No single metric perfectly measures real usefulness or realism.

### Limitations and ethical concerns
- unstable training
- hard controllability
- bias amplification
- deepfake misuse
- copyright/personality misuse

### GANs vs diffusion models
- Diffusion models are now favored in many image tasks because they are more stable and cover modes better.
- GANs still matter because:
  - they sample quickly
  - they remain conceptually important
  - they are still useful in some specialized image generation pipelines

## 9. Autoencoders

### What is an autoencoder?
- An unsupervised neural network trained to reconstruct its own input.
- It learns a compressed internal representation called a latent code.

### Core architecture
- `Encoder`
  - maps input `x` to latent representation `z`
- `Decoder`
  - reconstructs `x_hat` from `z`

### Learning objective
- Minimize reconstruction error between `x` and `x_hat`.
- Common losses:
  - mean squared error
  - binary cross-entropy depending on data type

### Why autoencoders matter
- learn representations without labels
- compress data
- denoise signals
- detect anomalies
- provide a base for generative variants like VAE

### Applications
- dimensionality reduction
- feature extraction
- denoising
- anomaly detection
- data compression
- image representation learning

### Variants

#### Vanilla autoencoder
- Basic encoder-decoder with reconstruction loss.

#### Sparse autoencoder
- Adds a sparsity constraint to hidden activations.
- Prevents trivial identity mapping and pushes more meaningful features.

#### Denoising autoencoder
- Corrupts input and trains the model to recover the clean version.
- Learns robust representations.

#### Variational Autoencoder (VAE)
- Probabilistic version.
- Encoder outputs parameters of a latent distribution, not just a point.
- Supports sampling and generation from latent space.

#### Convolutional autoencoder
- Uses convolution layers for images.
- Exploits spatial structure and parameter sharing.

### Autoencoder training process
1. Initialize encoder and decoder.
2. Feed input through encoder to latent code.
3. Reconstruct through decoder.
4. Compute reconstruction loss.
5. Backpropagate and update weights.

### Loss functions
- `MSE`
  - common for continuous-valued reconstruction
- `Binary cross-entropy`
  - common for normalized/binary-style outputs
- `VAE loss`
  - reconstruction term + KL divergence regularization

### Best practices
- choose latent dimension carefully
- avoid latent spaces that are too large, or model learns identity mapping
- regularization matters
- data-specific architecture matters

### Autoencoders vs GANs
- Autoencoders focus on compress/reconstruct.
- GANs focus on adversarial realism.
- VAEs are more explicitly generative than vanilla autoencoders.

## 10. Transformers And Attention Deep Dive

### What is a transformer?
- A neural architecture based entirely on attention mechanisms.
- Removes recurrence and uses parallel sequence processing.

### Core transformer pipeline
1. tokenize input
2. convert tokens to embeddings
3. add positional information
4. process through stacked attention + feed-forward blocks
5. decode outputs depending on task

### Positional encoding
- Needed because attention alone does not encode order.
- Can be:
  - sinusoidal
  - learned
  - rotary/relative methods in modern variants

### What is attention?
- A mechanism that lets the model weigh how much one token should focus on other tokens when building a representation.

### Scaled dot-product attention
- Computes similarity between query and keys.
- Uses softmax to create normalized attention weights.
- Produces a weighted combination of values.

### Multi-head attention
- Multiple heads let the model learn different relational patterns at once.
- Examples:
  - syntactic dependency
  - entity reference
  - semantic linkage
  - positional relationships

### Self-attention vs cross-attention
- `Self-attention`
  - Q, K, V come from the same sequence
  - used to model internal dependencies
- `Cross-attention`
  - queries come from one sequence and keys/values from another
  - common in encoder-decoder models

### Transformer advantages
- full-sequence parallelism during training
- better long-range dependency modeling than RNNs
- highly scalable with data and compute
- flexible across text, image, code, audio, and multimodal settings

### Transformer limitations
- attention cost grows badly with sequence length in vanilla form
- large memory use
- expensive training
- requires strong alignment and grounding to avoid bad outputs

## 11. Cross-Topic Comparisons

### GAN vs Autoencoder vs Transformer
| Aspect | GAN | Autoencoder | Transformer |
|---|---|---|---|
| Main purpose | realistic data generation | representation learning and reconstruction | sequence modeling and general-purpose generation |
| Core mechanism | adversarial game | encoder-decoder reconstruction | attention |
| Training stability | hard | relatively stable | stable at scale but expensive |
| Best known for | image realism | compression/latent representation | language and multimodal systems |
| Typical weakness | mode collapse | blurry reconstructions/basic generations | compute and memory cost |

### Foundation models vs classical ML
- Classical ML:
  - narrow, feature-engineered, task-specific
- Foundation models:
  - broad, pre-trained, adaptable, promptable

### SLM vs LLM
- SLM:
  - efficient, cheaper, deployable
- LLM:
  - stronger general capabilities, but expensive and slower

### BERT vs GPT vs T5
| Model type | Architecture | Strength |
|---|---|---|
| BERT | encoder-only | understanding and representation |
| GPT | decoder-only | generation and chat |
| T5 | encoder-decoder | text transformation tasks |

## 12. Likely Exam / Viva Angles

### High-value definitions
- AI
- Generative AI
- Foundation model
- LLM
- SLM
- GAN
- Autoencoder
- Transformer
- Self-attention
- RLHF

### High-value comparisons
- AI vs Generative AI
- Rule-based AI vs machine learning
- CNN vs RNN vs Transformer
- Foundation models vs traditional ML
- SLM vs LLM
- BERT vs GPT vs T5
- GAN vs VAE vs Transformer
- GAN vs diffusion models

### High-value explain questions
- Explain the history of AI with AI winters.
- Explain why transformers replaced RNNs in many tasks.
- Explain the end-to-end GenAI workflow.
- Explain RLHF.
- Explain GAN architecture and objective.
- Explain autoencoder variants.
- Explain multi-head attention.
- Explain Mixture of Experts.

## 13. One-Screen Revision Sheet

- AI moved from rule-based systems to ML, then deep learning, then generative AI.
- Generative AI creates new content instead of only classifying or predicting.
- Foundation models are large pre-trained models adapted to many tasks.
- Transformers dominate modern GenAI because self-attention scales better than recurrence.
- LLMs are large transformer-based language models with emergent capabilities.
- SLMs trade capability for lower cost, lower latency, and easier deployment.
- GenAI workflow is: data -> pre-train -> fine-tune/align -> evaluate -> deploy -> monitor.
- RLHF aligns model behavior with human preferences.
- BERT is encoder-only, GPT is decoder-only, T5 is encoder-decoder.
- GANs use generator vs discriminator adversarial training.
- GAN challenges are instability and mode collapse.
- Autoencoders learn compressed latent representations and reconstruct inputs.
- VAEs are probabilistic autoencoders that support generation.
- Attention computes relevance across tokens; multi-head attention captures multiple relationships in parallel.

## 14. Bottleneck You Should Not Ignore

- The course material mixes stable theory with fast-changing model snapshots. Historical concepts like GANs, RLHF, self-attention, and encoder/decoder design are safe study targets. Model-comparison slides, vendor examples, and ecosystem rankings will age first, so memorize the concepts and use the named models only as examples.
