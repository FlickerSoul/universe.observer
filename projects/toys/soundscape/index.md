---
title: Soundscape
#subtitle: 
abstract: An Android application providing hands-free navigation using spatial audio,  empowering visually impaired people to navigate the world at ease.
lang: en
#langs: 
tags: 
  - Android
  - kotlin
  - C++
createdAt: 2024-04-03
updatedAt: 2023-04-03
#hidden: 
#hasComments:
---

## Introduction

The idea of using Spatial Audio to navigate isn't new. Soundscape was originally incubated and developed on iOS by Microsoft Research. The app serves spatial audio to indicate the user's destination and surroundings as if the sound comes from th ose places, by leveraging the global position and orientation obtained from Airpods' the head tracking sensors and other sensors from user's phones (such as GPS and magnetometer). The app, designed with visually impaired people in mind, provides a hands-free navigation experience, allowing users to navigate the world and get familiar with their surroundings.

However, the app is only available on iOS, which has only a relatively small market share, compared to its competitor, Android. Therefore, the cofonder of the project requested 8 of us in UCL Software Systems Engineering to port a minimal viable product of Soundscape to Android.

The project  first went though the planning phase, where were discussed the requirements,  the architecture,  and the timeline. The app has several  core features:

- **Navigation with audio beacon**: the app indicates the user's destination using a continuous audio cue that changes it's quality based on the user's orientation: the better the orientation is aligned with the destination, the more positive the sound cue is. We call this continuous sound cue as audio beacon.
- **Callouts of surroundings**: the app calls out the user's surroundings when they request so or when they move around. The callouts are also spatialized as if the callout sound originates from the place it describes. For example, when you walk along the street, you will hear "cafe 10 meters" from your right (because there is a cafe cross the street 10 meters away), and "bus stop, 20 meters" from your front left (because you will see a bus stop if you turn left  around in the upcoming crossing).
- **Markers and Routes**: the app allows the user to save markers (a location they are interested in, such as a particular bus stop or grocery store) and routes (a sequence of markers that the user want to follow). This allows the user to navigate themselves to where they want to be easily.

We have also implemented many other essential functionalities such as settings that controls many aspects of audio, the integration with Google maps, and accessibility integrations with TalkBack and VoiceOver.

The architecture of Soundscape is designed to be event driven. This is because the audios are played based on the user's location, orientation, and movement, which are all events that flow from sensors or user interactions.

We divided 8 of us into 4 groups, each responsible for a different component of the app:

- UI team: all the UI components and data persistence
- Map team: integrations with Google Maps and OpenStreetMap, along with utilities for computations and data pipeline of objects on the maps
- Sensor team: sensor data retrieval as services and sensor data processing
- Audio team: audio engine that uses Text-to-Speech to synthesis callouts from text, spatializes, mixes, and plays audio cues and callouts, and provides a event loop for callouts responding to user movements.
- Both sensor team ang audio team work on a event bus that's used to carry data and share among modules.

Because of the time constraint, there are still many great features that  weren't listed in our planning. However, we hope the future team can take over our work and continue making Soundscape a  complete and optimal navigation solution for people who need it.

## Technologies, Challenges, and What I Have Done

We decided to use Kotlin (with JNI) for developmemt, Jetpack Compose for UI, Room for persistence, and, latter in the course, hilt (dagger) for dependency injection and proto DataStore for lightweight data persistence duch as values in settings.

I worked in the audio team, addling with Raimund, because I think the audio part is the most challenging and interesting component of the app. It turned put to be true, because unlike iOS which provides many AMAZING high-level and yet POWERFUL audio APIs and access to AirPods' head tracking sensors, Android has very limited APIs that allow  the level of customizability and control we need.

The first stage was to find a suitable library for audio spatialization and customization. It was clear to us that it is impossible to implement an engine from scratch and that there didn't seem to exit anything high level in the kotlin world. We decided to use JNI and focus on engines implemented in C or C++. There are many choices on the market: Steam Audio, Oboe, OpenAL, FMOD, SoLoud, etc. We chose SoLoud because it is open source, powerful, and lightweight. The only down side is that SoLoud, even though it works, is not actively maintained: the existing audio backend support for Android (OpenSL ES) is already deprecated, and the new backend (AAidio) is out of horizon. 

(To be continued)
