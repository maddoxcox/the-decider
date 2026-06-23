 import "dotenv/config";                                                                           
  import express from "express";
  import cors from "cors";                                                                          
  import Anthropic from "@anthropic-ai/sdk";
  import path from "path";

  const app = express();
  app.use(cors());
  app.use(express.json());                                                                          
   
  const client = new Anthropic();                                                                   
                  
  const VOICE_PROMPTS = {                                                                           
    "Drill Sergeant": `You are a loud, intense military drill sergeant. You bark orders, call the 
  user 'maggot' or 'recruit', and treat this decision like a life-or-death battlefield command.     
  Short, punchy sentences. No softness.`,
    "Chaotic Gremlin": `You are a mischievous, unhinged gremlin who thrives on chaos. You cackle,   
  use chaotic energy, and pick the most fun or absurd option. You talk like a creature who just     
  escaped a lab and is having the time of its life.`,
    "Wise Grandma": `You are a warm, wise grandmother who has seen it all. You give your pick with  
  gentle authority, sprinkle in life wisdom, and make the user feel like everything will be okay.   
  You call them 'dear' or 'sweetheart'.`,
    "Blunt Best Friend": `You are the user's brutally honest best friend. No sugarcoating. You tell 
  it like it is with casual, direct language. You roast them a little for not being able to decide  
  on their own.`,
  };                                                                                                
                  
  app.post("/decide", async (req, res) => {
    const { options, constraints, voice } = req.body;
                                                                                                    
    const systemPrompt = `${VOICE_PROMPTS[voice]}
                                                                                                    
  You are "The Decider." The user can't make up their mind, so you will pick ONE option and defend  
  it aggressively in character.
                                                                                                    
  Reply ONLY with valid JSON in this exact format, no other text:
  {"pick": "the option you chose", "defense": "your in-character defense of this pick (2-4 
  sentences)"}`;                                                                                    
   
    const userMessage = `Here are my options: ${options.join(", ")}                                 
                  
  Constraints:                                                                                      
  - Mood: ${constraints.mood || "not specified"}
  - Time available: ${constraints.timeAvailable || "not specified"}
  - Who's around: ${constraints.whoIsAround || "not specified"}                                     
   
  Pick one and defend it.`;                                                                         
                  
    try {                                                                                           
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,                                                                       
        messages: [{ role: "user", content: userMessage }],
      });                                                                                           
                  
    	const raw = message.content[0].text.replace(/```json\n?|\n?```/g, "").trim();
  		const parsed = JSON.parse(raw);                                                                  
      console.log("Claude responded:", parsed);
      res.json(parsed);                                                                             
    } catch (err) {
      console.error("Error:", err);                                                                 
      res.status(500).json({ error: "Failed to get a decision" });
    }                                                                                               
  });
  
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (req, res) => res.sendFile(path.join(process.cwd(), "dist", "index.html")));
                                                                                                    
  app.listen(3001, () => console.log("Server running on http://localhost:3001"));
