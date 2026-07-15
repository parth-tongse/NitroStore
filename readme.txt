========================================================================
 NITROSTORE - LOCAL DEVELOPMENT SETUP GUIDE (VS CODE)
========================================================================

Aap is project ko apne computer par local VS Code setup me neeche diye gaye steps follow karke aasani se run kar sakte hain:

------------------------------------------------------------------------
STEP 1: PREREQUISITES (ZAROORI SOFTWARE)
------------------------------------------------------------------------
Sabse pehle check karein ki aapke system me Node.js aur npm installed hain:
1. Node.js (Version 18 ya usse bada) download karein: https://nodejs.org/
2. VS Code editor download karein (agar nahi hai toh): https://code.visualstudio.com/

------------------------------------------------------------------------
STEP 2: PROJECT FILES EXTRACT KAREIN & OPEN KAREIN
------------------------------------------------------------------------
1. AI Studio Build se download kiye gaye ZIP file ko extract karein.
2. VS Code ko open karein.
3. Menu me jaakar "File" -> "Open Folder..." select karein aur is extracted folder ko select karke open karein.

------------------------------------------------------------------------
STEP 3: LOCAL ENVIRONMENT VARIABLES (.env) SETUP KAREIN
------------------------------------------------------------------------
Is project me ek integrated Google Gemini AI Chatbot hai, jiske liye Google Gemini API Key zaroori hai.
1. Project ke root folder me ek nayi file banayein jiska naam `.env` rakhein.
2. Us file me neeche likhi lines copy karke save karein:
   
   GEMINI_API_KEY="Aapki_Gemini_API_Key_Yahan_Dalein"
   APP_URL="http://localhost:3000"

*(Note: Aap Gemini API key Google AI Studio portal se bilkul free me generate kar sakte hain)*

------------------------------------------------------------------------
STEP 4: DEPENDENCIES INSTALL KAREIN
------------------------------------------------------------------------
1. VS Code me Terminal open karein (Shortcut: Ctrl + `  ya  Cmd + `).
2. Terminal me neeche likha command run karein:
   
   npm install

   Yeh command backend server (Express), frontend packages (React, Vite, Tailwind CSS, Lucide Icons, aur animations) download aur install karega.

------------------------------------------------------------------------
STEP 5: PROJECT KO RUN KAREIN (FULL-STACK DEV MODE)
------------------------------------------------------------------------
Terminal me install successfully complete hone ke baad, neeche likha command run karein:

   npm run dev

Isse aapka Express + Vite integrated backend and frontend server start ho jayega. Terminal me ek link show hoga:
   http://localhost:3000

Browser me is link ko open karein, aapka full-featured NitroStore (lofi background music, secure Admin/Customer gateways, live shopping cart, and integrated AI Chatbot) local machine par chalne lagega!

------------------------------------------------------------------------
STEP 6: ADMIN / CUSTOMER CREDENTIALS (TESTING KE LIYE)
------------------------------------------------------------------------
- Is portal par naye users ke liye real registration (Sign Up) flow set hai. Jab tak koi user "Sign Up" me register nahi karega, tab tak wo login nahi kar payega.
- Test karne ke liye login screen par "Fill Customer Info" button hai jo automatic email fill kar dega.
- Admin portal access karne ke liye Admin gateway par email `parthtongse66@gmail.com` aur password (`Parth@#172005`) verify karke login karein. "Auto Fill Keys" par click karke direct testing login ho jayega.

------------------------------------------------------------------------
ADDITIONAL SCRIPTS (OPTIONAL):
------------------------------------------------------------------------
- Full-Stack production build compile karne ke liye:
  npm run build

- TypeScript validation check karne ke liye:
  npm run lint

Aapka local configuration full responsive hai aur real validation ke sath test ke liye tayar hai! Thank you!
========================================================================
