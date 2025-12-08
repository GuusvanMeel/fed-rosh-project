# Rosh Website Builder

**Rosh Website Builder** is een visuele website builder ontwikkeld voor **Rosh**. Het project biedt een eenvoudige en intuïtieve manier om websites te bouwen zonder programmeerkennis. Gebruikers kunnen elementen zoals tekst, afbeeldingen, video’s en scrollende panels slepen en neerzetten in secties en kolommen, waardoor het maken van een webpagina net zo eenvoudig wordt als werken met een design tool.

## Bekijk de website hier: [FED Rosh App](https://fed-roshan-project.vercel.app/)




## Features

- Drag-and-drop panels voor content  
- Panelwaarden aanpassen via een gebruiksvriendelijke interface  
- Automatische schaalbaarheid tussen desktop en mobiele weergave  
- Flexibele secties en kolommen voor custom designs  


## Technologieën

- **Framework:** Next.js  
- **Taal:** React + TypeScript  
- **Styling & UI:** ChakraUI, Tailwind CSS  
- **Drag & Drop:** DnD-Kit  
- **Database & Auth:** Supabase  
- **hosting** vercel

## Team & Contributions

### [Maarten](https://github.com/Maarten0162) | [Portfolio](https://portfolio-website-ecru-omega-46.vercel.app/)

- Alle type panels ontwikkeld  
- Cloudinary image- en video-upload geïmplementeerd  
- Complete UI-overhaul met Chakra UI  
- Drag-and-drop functionaliteit in de sidebar toegevoegd

### [Jeffrey](https://github.com/WorldwideErrors)

- Sidebar met aanpasbare standaardstijlen (achtergrond, primaire, secundaire en accentkleuren)
- Implementatie van verschillende base-fonts 
- Laden van componenten in de sidebar  

### Sjoerd

*Bijdragen nog niet gespecificeerd*

### [Guus](https://github.com/GuusvanMeel) | [Portfolio](https://portfolio-fed-guus-projects-37e43d70.vercel.app/)

- Secties en dropzones
- het kunnen slepen van de panelen
- Hulp bij panel-customization en algemene componenten  

## Gebruik

De applicatie is volledig visueel en vereist geen commandoregel. Alles kan via de interface worden gebouwd en bewerkt.  

## File Structure
```txt
fed-rosh-project/
├── .gitignore
├── app/
│   ├── component/
│   │   ├── canvas/
│   │   │   ├── Canvas.tsx
│   │   │   └── canvasSideBar.tsx
│   │   ├── Counter.tsx
│   │   ├── DialogBox.tsx
│   │   ├── editForm.tsx
│   │   ├── MyColorPicker.tsx
│   │   ├── panel.tsx
│   │   ├── panels/
│   │   │   ├── BracketPanel.tsx
│   │   │   ├── CountdownPanel.tsx
│   │   │   ├── ImagePanel.tsx
│   │   │   ├── PanelList.tsx
│   │   │   ├── panelModal.tsx
│   │   │   ├── panelRegistry.ts
│   │   │   ├── panelWrapper.tsx
│   │   │   ├── ScrollingTextPanel.tsx
│   │   │   ├── TextPanel.tsx
│   │   │   ├── UrlPanel.tsx
│   │   │   └── VideoPanel.tsx
│   │   ├── panelsettings/
│   │   │   └── PanelSettings.tsx
│   │   ├── reactbits/
│   │   │   ├── CurvedLoop.css
│   │   │   └── CurvedLoop.jsx
│   │   ├── Sections/
│   │   │   ├── Droppable.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── SectionCanvas.tsx
│   │   │   └── SectionWrapper.tsx
│   │   ├── sidebar.tsx
│   │   ├── SortableList.tsx
│   │   └── UploadWidget.tsx
│   ├── design-patterns/
│   │   ├── ColorPanel.tsx
│   │   ├── DesignContext.tsx
│   │   ├── designPaletteTypes.tsx
│   │   └── FontPanel.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── hooks/
│   │   └── handleDrags.ts
│   ├── layout.tsx
│   ├── new/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── page.tsx
│   └── types/
│       ├── canvas.ts
│       └── panel.ts
├── components/
│   └── ui/
│       ├── color-mode.tsx
│       ├── panelsettingsform.tsx
│       ├── provider.tsx
│       ├── toaster.tsx
│       └── tooltip.tsx
├── components.json
├── eslint.config.mjs
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── queries/
│   │   │   ├── deletePanel.ts
│   │   │   ├── getPanels.ts
│   │   │   └── savePanels.ts
│   │   └── server.ts
│   └── utils.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
└── tsconfig.json
```

## Licentie

Geen specifieke licentie van toepassing. Het project is uitsluitend ontwikkeld voor Rosh.
