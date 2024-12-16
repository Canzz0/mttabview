# MtTabView: Flexible and Simple Tab View Library for React Native

MtTabView is a library designed to help you easily create tab views in your React Native applications. It enables modern, fast, and flexible tab transitions for an improved user experience.

🚀 Features
Dynamic Tab Support: Add as many tabs as you need for your project.
Component-Based Structure: Define custom React components for each tab.
Customizable Styles: Personalize the appearance of tab headers and underline (active tab indicator).

📦 Installation
```bash
npm install mt-tabview  
or
yarn add mt-tabview  
```

🛠️ Usage
```typescript
import React from 'react';  
import { Mttab } from 'native-MtTab';  

const App = () => {  
  const data = React.useMemo(() => [  
    { key: 'React', component: <ReacT /> },  
    { key: 'Native', component: <Native /> },  
    { key: 'MtTab', component: <Tab /> },  
  ], []);  

   //optional
  const style = {  
    underline: {  
      height: 2,  
      backgroundColor: '#367CBA',  
      marginBottom: 15,  
    },  
    headerText: {  
      color: darkMode ? Colors.DarkText : Colors.LightText,  
      fontSize: 13,  
      justifyContent: 'flex-start',  
      textAlign: 'center',  
      fontWeight: '600',  
    },  
  };  

  return (  
    <Mttab  
      textstyle={style.headerText}  
      linestyle={style.underline}  
      data={data}  
    />  
  );  
};  

export default App;
```

✨ Customizable Styles
textstyle: Defines the style for tab headers.
linestyle: Configures the style of the underline (active tab indicator).
🎥 Demo
Check out the gif below to see MtTabView in action, showcasing its seamless tab transitions:
![MtTabView Demo](https://github.com/Canzz0/mttab/blob/main/demo.gif)
🌟 Advantages
Easy Integration: Set up in just a few steps.
Performance Optimized: Efficiently manages dynamic components.
Modern and Minimalist Design: Provides a user-friendly interface.
