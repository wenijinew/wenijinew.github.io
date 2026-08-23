# Computer Vision

*Written: 2026-08-23*

## Task Taxonomy

| Task | Input | Output | Example |
|------|-------|--------|---------|
| Classification | Image | Class label | Cat vs Dog |
| Object Detection | Image | Bounding boxes + labels | YOLO detecting cars |
| Semantic Segmentation | Image | Per-pixel class label | Road/sidewalk/sky |
| Instance Segmentation | Image | Per-pixel + instance ID | Each individual person |
| Panoptic Segmentation | Image | Semantic + instance combined | Complete scene parsing |
| Pose Estimation | Image | Keypoint coordinates | Human skeleton |
| Depth Estimation | Image (mono/stereo) | Depth map | Autonomous driving |
| Optical Flow | 2 frames | Per-pixel motion vectors | Video analysis |
| Image Generation | Noise/text | Image | Stable Diffusion |
| Super-Resolution | Low-res image | High-res image | ESRGAN 4× upscale |
| OCR | Image with text | Text string | Document digitization |

---

## Image Classification

### Evolution of Architectures

| Era | Architecture | Key idea | Top-1 ImageNet |
|-----|-------------|----------|----------------|
| 2012 | AlexNet | Deep CNN + GPU + ReLU + Dropout | 63.3% |
| 2014 | VGG-16/19 | Uniform 3×3 convs, deeper | 74.4% |
| 2014 | GoogLeNet | Inception modules (multi-scale) | 74.8% |
| 2015 | ResNet-152 | Residual connections | 78.3% |
| 2017 | DenseNet-264 | Dense connections | 77.8% |
| 2019 | EfficientNet-B7 | Compound scaling (d×w×r) | 84.4% |
| 2020 | ViT-L/16 | Pure Transformer on patches | 87.8% |
| 2022 | ConvNeXt-XL | Modernized CNN (Transformer tricks) | 87.8% |
| 2023 | EVA-02-L | CLIP + masked image modeling | 90.0% |
| 2024 | SigLIP-SO400M | Sigmoid loss + large-scale contrastive | 90.5%+ |

### Data Augmentation for Vision

| Technique | Method | When to use |
|-----------|--------|-------------|
| Random crop + resize | Crop random region, resize to input size | Always (standard) |
| Horizontal flip | Mirror image | Most tasks (not text/handwriting) |
| Color jitter | Random brightness, contrast, saturation, hue | Natural images |
| Random erasing (Cutout) | Mask random rectangle with zeros | Regularization |
| Mixup | Blend two images and labels linearly | General regularization |
| CutMix | Replace patch with another image's patch | Better than Cutout |
| RandAugment | Random chain of N augmentations at magnitude M | Easy to tune (just N, M) |
| AutoAugment | Search for optimal augmentation policy | Maximum accuracy (expensive) |
| TrivialAugment | Single random augmentation per image | Simple, competitive |
| AugMax | Adversarial augmentation (worst-case) | Robustness |

---

## Object Detection

### Two-Stage Detectors

```
Image → Backbone (feature extraction) → Region Proposal Network → ROI features → Classification + Regression
                                              │
                                    ~1000 candidate regions
```

| Model | Year | Innovation |
|-------|------|-----------|
| R-CNN | 2014 | Selective search + CNN per region |
| Fast R-CNN | 2015 | Shared features, ROI pooling |
| Faster R-CNN | 2015 | Learnable Region Proposal Network (RPN) |
| Mask R-CNN | 2017 | + instance segmentation branch |
| Cascade R-CNN | 2018 | Multi-stage refinement with increasing IoU thresholds |

### One-Stage Detectors

```
Image → Backbone → Feature Pyramid → Dense predictions at every location
                                          │
                              (class + bbox for each anchor/point)
```

| Model | Year | Key innovation | Speed |
|-------|------|----------------|-------|
| SSD | 2016 | Multi-scale feature maps | 46 FPS |
| YOLOv3 | 2018 | Darknet-53, multi-scale prediction | 30 FPS |
| RetinaNet | 2017 | Focal loss (solves class imbalance) | 18 FPS |
| FCOS | 2019 | Anchor-free, per-pixel prediction | 27 FPS |
| YOLOv5/v7/v8 | 2020-23 | Engineering optimizations, mosaic augmentation | 60-160 FPS |
| YOLOv10 | 2024 | NMS-free, consistent dual assignments | 70+ FPS |

### Transformer-Based Detectors

| Model | Year | Approach |
|-------|------|----------|
| DETR | 2020 | Set prediction with Transformer encoder-decoder, bipartite matching |
| Deformable DETR | 2021 | Deformable attention (sparse, multi-scale) — faster convergence |
| DINO | 2022 | Contrastive denoising + anchor boxes, SOTA |
| RT-DETR | 2023 | Real-time DETR with hybrid encoder |
| Grounding DINO | 2023 | Open-vocabulary detection (text → boxes) |

### Detection Metrics

| Metric | Definition |
|--------|-----------|
| IoU (Intersection over Union) | Area(pred ∩ gt) / Area(pred ∪ gt) |
| AP (Average Precision) | Area under precision-recall curve at one IoU threshold |
| AP@0.5 | AP with IoU threshold = 0.5 |
| AP@0.5:0.95 | Mean AP across IoU thresholds [0.5, 0.55, ..., 0.95] (COCO primary) |
| mAP | Mean AP across all classes |
| AR (Average Recall) | Max recall at fixed number of detections |

**Non-Maximum Suppression (NMS):**

```
1. Sort detections by confidence score (descending)
2. Select highest confidence detection → add to final list
3. Remove all detections with IoU > threshold (e.g., 0.5) with selected box
4. Repeat from step 2 until no detections remain
```

---

## Semantic Segmentation

### Architectures

| Model | Year | Key idea |
|-------|------|----------|
| FCN | 2015 | Fully convolutional, skip connections for resolution |
| U-Net | 2015 | Encoder-decoder with skip connections (medical) |
| DeepLab v3+ | 2018 | Atrous (dilated) convolution + ASPP + decoder |
| HRNet | 2019 | Maintain high-resolution throughout network |
| SegFormer | 2021 | Hierarchical Transformer encoder + MLP decoder |
| Mask2Former | 2022 | Universal segmentation (semantic + instance + panoptic) |
| SAM (Segment Anything) | 2023 | Foundation model for segmentation (promptable) |
| SAM 2 | 2024 | Video + image segmentation, streaming architecture |

### U-Net Architecture

```
Input (256×256×3)
    ↓ [Conv 64] ──────────────────────────────────── [Concat + Conv 64] → Output
    ↓ [Pool]                                              ↑ [UpConv]
    ↓ [Conv 128] ─────────────────────────────── [Concat + Conv 128]
    ↓ [Pool]                                              ↑ [UpConv]
    ↓ [Conv 256] ────────────────────────── [Concat + Conv 256]
    ↓ [Pool]                                        ↑ [UpConv]
    ↓ [Conv 512] ───────────────────── [Concat + Conv 512]
    ↓ [Pool]                                  ↑ [UpConv]
    → [Conv 1024 — Bottleneck] ──────────────→

Encoder (contracting): captures context via downsampling
Decoder (expanding): enables precise localization via upsampling
Skip connections: preserve spatial detail lost during downsampling
```

### Segmentation Loss Functions

| Loss | Formula concept | Best for |
|------|----------------|----------|
| Cross-Entropy (per pixel) | Standard CE averaged over all pixels | Balanced classes |
| Weighted CE | Higher weight for rare classes | Class imbalance |
| Dice Loss | 1 - 2\|P∩G\|/(|P|+|G|) | Small objects, imbalance |
| Focal Loss | Down-weight easy pixels | Extreme imbalance |
| Lovász-Softmax | Surrogate for IoU optimization | Directly optimize IoU |
| Boundary Loss | Distance-based loss on contours | Precise boundaries |

---

## Pose Estimation

### Approaches

| Approach | Method | Example |
|----------|--------|---------|
| Top-down | Detect person → estimate keypoints per person | HRNet, ViTPose |
| Bottom-up | Detect all keypoints → group into persons | OpenPose, HigherHRNet |
| Single-stage | Direct regression of all keypoints | CenterNet, KAPAO |
| Transformer | Token-based keypoint prediction | TokenPose, ViTPose |

### COCO Keypoints (17 points)

```
Nose, Left Eye, Right Eye, Left Ear, Right Ear,
Left Shoulder, Right Shoulder, Left Elbow, Right Elbow,
Left Wrist, Right Wrist, Left Hip, Right Hip,
Left Knee, Right Knee, Left Ankle, Right Ankle
```

### Evaluation: OKS (Object Keypoint Similarity)

$$OKS = \frac{\sum_i \exp(-d_i^2 / 2s^2 k_i^2) \cdot \delta(v_i > 0)}{\sum_i \delta(v_i > 0)}$$

- d_i = Euclidean distance between predicted and ground-truth keypoint i
- s = object scale (√area)
- k_i = per-keypoint constant (harder keypoints have larger k)
- AP is then computed over OKS thresholds (like IoU in detection)

---

## Video Understanding

### Tasks

| Task | Description | Output |
|------|-------------|--------|
| Action recognition | Classify activity in video clip | Class label (e.g., "dancing") |
| Temporal action detection | Localize action start/end in long video | Time segments + labels |
| Video object tracking | Follow objects across frames | Bounding box trajectories |
| Video captioning | Generate text description of video | Natural language sentence |
| Video generation | Generate video from text/image | Video frames |

### Video Models

| Model | Year | Architecture | Approach |
|-------|------|-------------|----------|
| I3D | 2017 | Inflated 3D convolutions | Extend 2D CNN to 3D |
| SlowFast | 2019 | Dual pathway (slow + fast) | Capture temporal at different rates |
| TimeSformer | 2021 | Factorized space-time attention | Transformer for video |
| VideoMAE | 2022 | Masked autoencoder for video | Self-supervised pre-training |
| InternVideo2 | 2024 | Multi-modal video foundation model | SOTA on multiple benchmarks |

### Object Tracking

| Paradigm | Method | Example |
|----------|--------|---------|
| Tracking by detection | Detect per frame, associate across frames | DeepSORT, ByteTrack |
| Siamese tracking | Learn similarity between template and search region | SiamFC, SiamRPN++ |
| Transformer tracking | Attention-based template matching | TransTrack, MixFormer |
| Multi-object tracking | Track all objects simultaneously | FairMOT, QDTrack |

**DeepSORT Pipeline:**

```
Frame t → Detector → Detections
                        │
                        ▼
              ┌─────────────────┐
              │  Kalman Filter  │  ← predict next position
              │  (motion model) │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Hungarian      │  ← match predicted tracks to detections
              │  Algorithm      │     (using IoU + appearance features)
              └────────┬────────┘
                       │
              Updated tracks → Frame t+1
```

---

## 3D Vision

### Depth Estimation

| Method | Input | Approach |
|--------|-------|----------|
| Monocular depth | Single image | Learn depth from visual cues (trained on stereo/LiDAR) |
| Stereo depth | Two calibrated cameras | Triangulation via disparity |
| Multi-view stereo | Multiple views | Dense reconstruction |
| LiDAR | Laser scanner | Direct measurement (sparse but accurate) |
| Depth Anything v2 | Single image | Foundation model for monocular depth |

### 3D Representations

| Representation | Structure | Use case |
|---------------|-----------|----------|
| Point cloud | Unordered set of (x,y,z) points | LiDAR, 3D scanning |
| Voxel grid | 3D grid of occupied cells | 3D object detection |
| Mesh | Vertices + faces (triangles) | 3D modeling, graphics |
| NeRF | Neural implicit function f(x,y,z,θ,φ) → (color, density) | Novel view synthesis |
| 3D Gaussian Splatting | Explicit Gaussians in 3D space | Real-time novel view synthesis |
| Signed Distance Function | Distance to nearest surface at every point | Shape representation |

### Neural Radiance Fields (NeRF)

```
Input: 5D coordinate (x, y, z, θ, φ)
       position + viewing direction

Network: MLP → (RGB color, volume density σ)

Rendering (volume rendering integral):
C(r) = ∫ T(t) · σ(r(t)) · c(r(t), d) dt

where T(t) = exp(-∫ σ(r(s)) ds)  (accumulated transmittance)

Training: photometric loss between rendered and real images
Result: novel views from any angle
```

---

## Foundation Models for Vision

### Vision-Language Models

| Model | Year | Architecture | Capability |
|-------|------|-------------|-----------|
| CLIP | 2021 | Dual encoder (image + text) | Zero-shot classification, retrieval |
| ALIGN | 2021 | EfficientNet + BERT (noisy web data) | Image-text alignment |
| Florence-2 | 2024 | Unified Transformer | Captioning, detection, segmentation via prompts |
| LLaVA | 2023 | CLIP vision encoder + LLaMA | Visual question answering |
| GPT-4V | 2023 | Multimodal Transformer | General visual understanding |
| InternVL 2.5 | 2024 | Dynamic resolution + LLM | SOTA open multimodal |

### CLIP (Contrastive Language-Image Pre-Training)

```
Training:
    Image encoder: ViT-L/14 → image embedding (768-d)
    Text encoder:  Transformer → text embedding (768-d)
    
    Contrastive loss: maximize similarity of matching (image, text) pairs
                      minimize similarity of non-matching pairs
    
    Trained on 400M image-text pairs from the internet

Zero-shot classification:
    1. Encode all class names as text: "a photo of a {class}"
    2. Encode query image
    3. Pick class with highest cosine similarity
    
    → No training on target dataset needed!
```

### Segment Anything Model (SAM)

```
Image → Image Encoder (ViT-H) → Image Embedding (cached)
                                        │
Prompts (points/boxes/masks/text) → Prompt Encoder → 
                                        │
                                   Mask Decoder → Predicted masks + IoU scores

Key properties:
- Promptable: accepts points, boxes, masks, or text as input
- Trained on SA-1B (1 billion masks, 11 million images)
- Zero-shot transfer to any segmentation task
- Real-time with pre-computed image embeddings
```

---

## Practical Pipeline

### Training a Vision Model (PyTorch Example)

```python
# Standard vision training pipeline

transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.RandAugment(num_ops=2, magnitude=9),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

model = timm.create_model('convnext_base', pretrained=True, num_classes=10)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4, weight_decay=0.05)
scheduler = CosineAnnealingLR(optimizer, T_max=epochs)
criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
scaler = GradScaler()  # mixed precision

for epoch in range(epochs):
    for images, labels in train_loader:
        with autocast(device_type='cuda'):
            output = model(images.cuda())
            loss = criterion(output, labels.cuda())
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        optimizer.zero_grad()
    scheduler.step()
```

### Inference Optimization

| Technique | Speedup | Quality loss |
|-----------|---------|-------------|
| TensorRT conversion | 2-5× | None (FP16) to small (INT8) |
| ONNX Runtime | 1.5-3× | None |
| Batch inference | 2-4× (GPU utilization) | None |
| Input resolution reduction | 2-4× | Moderate |
| Model distillation | 3-10× | Small |
| Quantization (INT8) | 2-4× | Small |
| Pruning (structured) | 1.5-3× | Small to moderate |
| TorchScript/torch.compile | 1.3-2× | None |

---

## Datasets & Benchmarks

| Dataset | Task | Size | Metric |
|---------|------|------|--------|
| ImageNet-1K | Classification | 1.28M images, 1000 classes | Top-1 Accuracy |
| COCO | Detection + Segmentation | 330K images, 80 classes | mAP@0.5:0.95 |
| ADE20K | Semantic Segmentation | 25K images, 150 classes | mIoU |
| Cityscapes | Urban segmentation | 5K fine + 20K coarse, 30 classes | mIoU |
| KITTI | Autonomous driving (depth, flow, 3D) | 15K frames | Various |
| nuScenes | 3D detection + tracking | 1.4M 3D boxes | NDS |
| SA-1B | Segmentation | 11M images, 1B masks | — |
| OpenImages V7 | Detection + Segmentation | 9M images, 600 classes | mAP |
| LVIS | Long-tail detection | 2M instances, 1203 classes | AP (rare/common/frequent) |
