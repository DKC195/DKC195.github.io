---
title: Soccer Match Highlights Event Extraction
slug: soccer-match-highlights-event-extraction
summary: Built a multimodal AI pipeline that detects key match events and generates structured highlight outputs from full-length football videos.
audiences: [engineering, research]
tags: [Python, PyTorch, CRNN, OCR, FFmpeg, FastAPI]
status: completed
featured: true
year: 2025
period: 2025
relatedExperienceIds:
  - fusemachines-ai-fellowship
sections:
  - overview
  - pipeline
  - technical-decisions
  - outputs
links: []
---

## Overview

This capstone project focused on turning long-form sports footage into structured event data and clipped highlights. The system was designed to reduce manual review time and create reusable outputs for downstream applications.

## Pipeline

- OCR extracted scoreboard and visual match context from video frames.
- Audio processing identified likely event windows.
- A CRNN architecture with attention was used for audio event classification.
- FFmpeg handled processing and highlight clip generation.
- FastAPI exposed the output pipeline.

## Technical Decisions

The project used a multimodal approach because audio or video alone was not reliable enough for practical event extraction. Combining both signals improved confidence and made the output more useful.

## Outputs

The system generated structured JSON metadata and clipped highlight segments based on detected event timestamps.
