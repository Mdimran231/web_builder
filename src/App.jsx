import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { MdOutlineArrowUpward } from "react-icons/md";
import { ImNewTab } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import { RiComputerLine } from "react-icons/ri";
import { FaTabletAlt } from "react-icons/fa";
import { ImMobile2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from "./helper";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";

const App = () => {

const [darkMode, setDarkMode] = useState(true);

const [prompt, setPrompt] = useState("");
const [isShowCode, setIsShowCode] = useState(false);
const [isInNewTab, setIsInNewTab] = useState(false);
const [loading, setLoading] = useState(false);
const [previewSize, setPreviewSize] = useState("100%");


const [code, setCode] = useState(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebBuilder Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center h-screen m-0 font-sans">
    <div class="text-center p-8 bg-white shadow-xl rounded-2xl border border-purple-100">
        <h1 class="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-4">
            Ready to Build!
        </h1>
        <p class="text-gray-600 text-lg">
            Enter a prompt above to generate your AI website.
        </p>
        <div class="mt-6 inline-block animate-bounce text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </div>
    </div>
</body>
</html>
`);
useEffect(()=>{
document.body.className = darkMode ? "dark" : "light";
},[darkMode]);

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

function extractCode(response){
const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
return match ? match[1].trim() : response.trim();
}

const downloadCode = ()=>{
let blob = new Blob([code],{type:"text/plain"});
let url = URL.createObjectURL(blob);
let a = document.createElement("a");
a.href = url;
a.download = "webBuilderCode.html";
a.click();
};

async function getResponse(){

if(prompt === ""){
toast.error("Please enter a prompt!");
return;
}

setLoading(true);

const text_prompt = `You are an expert frontend developer and UI/UX designer. The user will provide a detailed prompt describing what kind of website they want. Based on the user’s description, generate a fully working, production-ready website as a single HTML file. Use only HTML, Tailwind CSS (via CDN), vanilla JavaScript, and GSAP (via CDN).

Strict output rules:
- Return the website as a single fenced Markdown code block with the language tag.
- Do NOT include any explanations or extra text.
. Do NOT leave any section empty. 
2. For 'About', 'Blog', and 'Contact' sections, write REAL descriptive text and modern UI cards, not just background colors.
3. Every section (Home, About, Services, Blog, Footer) must have a unique, modern design with proper padding and content.
4. If it's a multi-page feel, use ID-based navigation (e.g., <section id="about">) and ensure smooth scrolling.
5. Content density: Make sure the blog has at least 3 sample posts with images (use Unsplash URLs) and text.

Technical requirements:
1. Stack: HTML + Tailwind CSS CDN + vanilla JS + GSAP CDN
2. Fully responsive
3. Dark mode with toggle
4. GSAP animations
5. Glassmorphism + modern UI
6. Sticky navbar
7. Hero + Content + CTA + Footer

Website prompt: ${prompt}`;

try{

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash", // Correct model name
  contents: [{ role: "user", parts: [{ text: text_prompt }] }] // Vite/Gemini syntax fix
});

setCode(extractCode(response.text));

}catch(err){
toast.error("Something went wrong");
}

setLoading(false);

}

return (
<>

<Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

<div className="container px-6 md:px-20 lg:px-40 mt-10">

<h3 className="text-5xl md:text-3xl lg:text-4xl font-bold">
Create beautiful websites with{" "}
<span className="bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
WebBuilder
</span>
</h3>

<p className="headers">
Describe your website and AI will code for you.
</p>

{/* Prompt Input */}

<div className="inputBox mt-6 relative">

<textarea
className="w-full min-h-[120px] md:min-h-[140px]"
onChange={(e)=>setPrompt(e.target.value)}
value={prompt}
placeholder="Describe your website in detail..."
></textarea>

{prompt !== "" && (
<i
onClick={getResponse}
className="sendIcon absolute bottom-3 right-3 text-[20px] w-[35px] h-[35px] flex items-center justify-center bg-[#9933ff] rounded-full hover:opacity-80"
>
<MdOutlineArrowUpward/>
</i>
)}

</div>

{/* Preview Title */}

<p className="tittle">
Your AI-Generated Website will appear here.
</p>

{/* Preview */}

<div className="preview mt-4 w-full h-[500px] md:h-[600px]">

<div className="header w-full h-[70px] flex items-center justify-between px-4">

<h3 className="font-bold text-[16px]">Live Preview</h3>

<div className="icons flex flex-wrap items-center gap-[10px] justify-end">

<div
onClick={()=>setIsInNewTab(true)}
className="icon "
>
Open <ImNewTab/>
</div>

<div
onClick={downloadCode}
className="icon "
>
Download <IoMdDownload/>
</div>

<div
onClick={()=>setIsShowCode(!isShowCode)}
className="icon !w-auto px-3 py-2 flex items-center gap-2 text-sm"
>
{isShowCode ? "Hide Code" : "Show Code"}
{isShowCode ? <FaEyeSlash/> : <BiSolidShow/>}
</div>

</div>

</div>

{isShowCode ? (

<Editor
onChange={(code)=>setCode(code)}
height="100%"
theme="vs-dark"
defaultLanguage="html"
value={code}
/>

) : loading ? (
  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50/10 rounded-xl">
    <div className="flex flex-col items-center">
      <FadeLoader color="#9933ff" />
      <h3 className="text-xl md:text-2xl mt-8 font-semibold text-center">
        <span className="bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
          Generating
        </span>{" "}
        your website...
      </h3>
    </div>
  </div>
) : (

<iframe srcDoc={code} className="w-full h-full bg-white"></iframe>

)}

</div>

</div>

{/* Modal */}
{/* Modal / Open in Full Preview */}
// 1. State add karein (top par)
const [previewSize, setPreviewSize] = useState("100%"); // Default full width

// 2. Modal ke andar icons ko update karein
{isInNewTab && (
  <div className="modelCon">
    {/* modelBox ki width dynamic hogi */}
    <div className="modelBox" style={{ width: previewSize, transition: "0.3s" }}>
      
      <div className="header">
        <h3 className="text-black font-bold">Responsive View</h3>

        {/* Clicks handle karne ke liye icons update */}
        <div className="icons hidden md:flex text-gray-500 gap-6">
          <RiComputerLine 
            className={previewSize === "100%" ? "text-purple-600" : "cursor-pointer"} 
            onClick={() => setPreviewSize("100%")} 
            title="Desktop"
          />
          <FaTabletAlt 
            className={previewSize === "768px" ? "text-purple-600" : "cursor-pointer"} 
            onClick={() => setPreviewSize("768px")} 
            title="Tablet"
          />
          <ImMobile2 
            className={previewSize === "375px" ? "text-purple-600" : "cursor-pointer"} 
            onClick={() => setPreviewSize("375px")} 
            title="Mobile"
          />
        </div>

        <div className="closeIcon" onClick={() => { setIsInNewTab(false); setPreviewSize("100%"); }}>
          <IoMdClose size={24} />
        </div>
      </div>

      <iframe srcDoc={code} title="full-preview" className="fullIframe"></iframe>
    </div>
  </div>
)}

</>

);
};

export default App;