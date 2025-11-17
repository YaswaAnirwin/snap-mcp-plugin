## **Instructions**
You will build one or more web pages within an existing codebase that strictly uses the **Custom UI Library** ("C-UI") from the [instructions](./instructions) folder. The task involves adhering to scalability, maintainability, accessibility, and responsiveness standards while ensuring compliance with TypeScript safety and collaborative workflows.
 
### **Ultimate Objective**
1. Transform the provided UI designs, user requirements, and APIs into components and layouts using the **C-UI library**.
2. Collaboratively progress through incremental stages, ensuring alignment and approval for each step.
 
---
 
## **Steps to Follow**
 


## **Step 1: Gather Input**
```
Hello! I'm here to help you implement your UI designs using the C-UI library.
Could you provide the following details to get started?
• PBI link/ID (if applicable)
• Uploaded UI Design
• High-Level User Requirements
• Primary Data Sources / APIs

Additionally, confirm:
- **Should we maintain strict separation between different sections without any white spaces?**
- **If white spaces are necessary, which sections should include them, and at what spacing values?**

Once I have this information, I'll analyze your design and propose a layout structure using the C-UI library components.
```
For pbi data processing, follow the steps under [azure-devops-instructions.md](./azure-devops.instructions.md) to ensure accurate retrieval and formatting of work item details.

### **Step 2: Layout Proposal**
Analyze the provided UI design and define the layout structure. Present your proposal clearly while asking for feedback on spacing rules and preferences.
 
#### Example Proposal:
```
**LAYOUT PROPOSAL:**  
- The page design includes the following sections:  
   1. **Header:** Full-width at the top; includes navigation and search.  
   2. **Sidebar:** Left-aligned, vertical menu panel.  
   3. **Main Content:** A responsive grid for forms/cards.  
 
**Spacing Query:**  
Should we include white spaces between the following sections?  
- Header ↔ Sidebar: Yes/No?  
- Sidebar ↔ Main Content: Yes/No?  
 
Type "yes" to approve, "no" for changes, or specify spacing preferences for refinement.
```
 
### **Step 3: Component Mapping**
Determine the specific **C-UI components** required for each layout section and include details about props, themes, and accessibility considerations. Confirm spacing preferences again with explicit questions.
To get information about the C-UI components, refer to the [C-UI documentation](./instructions) and ensure you understand the available components and their props.
 
#### Example Component Mapping Proposal:
```
**COMPONENT MAPPING PROPOSAL:**  
- **Header Section:**  
   - Component: `<CUIHeader>`  
   - Props: `title="Home Page"`, `hasSearchBar={true}`  
   - Accessibility: Includes `aria-label`.
 
- **Sidebar Section:**  
   - Component: `<CUIMenu>`  
   - Props: `menuItems=[...]`
   - Accessibility: Supports keyboard navigation.
 
**Spacing Preferences:**  
Should white spaces be added between sections? Confirm specific spacing values (e.g., `margin: 10px`).
```
 
### **Step 4: Incremental Implementation**
1. Implement each section incrementally. For example:
   - **Header.tsx**
   - **Sidebar.tsx, Sidebar.module.css**
   - **Main Content files**
2. Before developing each section, download figma image of that section and check all color combination, position, spacing and font, size and other properties. follow the steps under [figma-instructions.md](./figma-instructions.md), verify every detail, and confirm with the user.
3. After implementing each section, prompt the user for feedback on spacing and component behavior.
4. Develop each piece in TypeScript with accompanying CSS modules, hooks, and tests.
5. Halt after completing each region to seek explicit feedback for white space inclusion and further refinements.

#### Example Implementation:
```tsx
// Header.tsx: Implements the Header using C-UI
import { CUIHeader } from 'c-ui';
const Header = () => (
<CUIHeader title="Home Page" hasSearchBar={true} aria-label="Main Header" />
);
export default Header;
```
 
```css
/* Header.module.css */
.header {
  padding: var(--cui-spacing-lg);
  background-color: var(--cui-color-bg-light);
}
```
 
Prompt the user:
```
Does the Header meet design expectations?  
- Should there be any white spaces around it? If yes, specify spacing (e.g., "Add margin: 20px").
```
 
### **Step 5: Approvals and Refinements**
- Iterate based on feedback before implementing the next section.
- Confirm alignment with spacing preferences dynamically at every stage.
 
---
 
## **Constraints**
1. All code must be **TypeScript-safe** and comply with project scalability, accessibility, and responsiveness rules.
2. Avoid deviations from the **Custom UI Library** unless explicitly authorized.
3. Proactively confirm spacing rules at every implementation stage.
 
---
 
## **Example Feedback Pattern**
1. Approve or request layout tweaks (e.g., "Adjust sidebar spacing").
2. Confirm component props and behavior (e.g., "Enable `isSearchable` for Header").
3. Validate spacing rules for each section (e.g., "Include margin between content and Sidebar").
 
---
 
## **Collaboration Guidelines**
1. **Incremental Progress:** Implement one section at a time for easier reviews.
2. **Modular Design:** Divide page logic cleanly into reusable components.
3. **Feedback Loop:** Seek explicit user approval at every stage, focusing on spacing and component specifications.
 
--- 
## **Notes**
Always ask the user about spacing explicitly. If unclear preferences exist, direct them to clarify decisions before moving forward. Adapt implementation dynamically based on responses.
