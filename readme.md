---
title: IHaveAStream
emoji: 🌍
colorFrom: purple
colorTo: pink
sdk: docker
pinned: true
app_port: 8000
---

# IHaveAStream

This is a **Stremio addon** that integrates external video streams into the platform.  
It was created with the idea of making sports content a little more accessible to everyone, given the often unreasonable rise in subscription costs.  

However, this is an **unstable and hard-to-maintain solution**: streams may change or stop working at any time.  
Apologies in advance for any possible malfunctions.

🔹 **Current functionality**  
- Retrieves **m3u8** video streams from [Rojadirecta](https://www.rojadirecta.eu).  

🔹 **Future goals**  
- The architecture is designed to be modular, making it easy to add **new streaming providers** beyond Rojadirecta.  
- The aim is to keep the addon flexible and expandable, supporting multiple content sources without changing the core logic.  

---

## Project status
The project is currently in its early stage: it supports a single provider, but the structure is ready to grow.  

---

## Disclaimer
This addon does not host or distribute any content directly: it only collects and organizes streams already publicly available online through the integrated providers.  

The use of these sources is at the user’s sole discretion.  
Any misuse, including unauthorized access to copyrighted material, is the **sole responsibility of the user**, not of the addon or its developers.

---

## Limitations
At the moment, the addon **discards all m3u8 video streams that use encryption (e.g. AES-128, SAMPLE-AES)**.  

The reason is that, in most cases, access to decryption keys is deliberately made complicated by providers.  
Handling the different ways keys are distributed is complex and highly inconsistent, especially since there may be many providers with very different implementations.  

As a result, only **unencrypted streams** are processed and made available, while encrypted ones are skipped.
