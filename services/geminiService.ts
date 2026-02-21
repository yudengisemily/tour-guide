
import { GoogleGenAI, Type } from "@google/genai";
import { GuideContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchGuideContent(spotName: string): Promise<GuideContent> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `你是一名知识渊博的人文地理学者和资深导游。请为景点“${spotName}”生成一份深度、具有学术性和启发性的导览内容。
    服务对象：15岁左右的青少年（初高中生）。
    
    内容要求：
    1. 【人文名片】：用一句话高度概括该景点的核心历史或文化价值。
    2. 【史海钩沉】：详细描述景点的历史背景、朝代更迭或重大的社会变迁。请使用规范的历史术语，体现历史逻辑。
    3. 【文学与美学】：挖掘该景点涉及的经典诗词、散文或美学特征（如建筑结构原理、艺术风格流派）。
    4. 【当代回响】：分析该景点在现代社会的意义，包括影视记录、文学改编或其作为文化符号的地位。
    5. 【思辨时刻】：提出2个具有深度的问题，引导学生思考历史保护、文化传承或社会哲学问题。
    
    语言风格：专业、精炼、富有感召力。避免低幼化表达。
    
    请严格按照以下JSON格式输出：
    {
      "name": "景点全称",
      "card": "核心文化定位（如：跨越千年的木构奇迹）",
      "origin": ["历史背景点1", "历史背景点2", "关键人物或事件影响", "建筑/地理演变分析"],
      "gossip": ["文学典故或美学分析1", "艺术特征或文献考证2", "现场值得深入观察的专业细节"],
      "media": "相关的纪录片、学术著作、名家诗篇或现代影视",
      "interaction": ["深度探讨问题1：关于历史/文化", "深度探讨问题2：关于当代/个人启示"]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          card: { type: Type.STRING },
          origin: { type: Type.ARRAY, items: { type: Type.STRING } },
          gossip: { type: Type.ARRAY, items: { type: Type.STRING } },
          media: { type: Type.STRING },
          interaction: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "card", "origin", "gossip", "media", "interaction"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export async function generateSpotImage(spotName: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A cinematic, atmospheric, high-resolution photograph of ${spotName}. Professional architectural photography, historical site atmosphere, documentary style, rich textures, authentic colors, wide angle.` }]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed", error);
    return `https://images.unsplash.com/photo-1599572236599-c30362afbc3a?auto=format&fit=crop&w=1200&q=80`; // Fallback image
  }
}
