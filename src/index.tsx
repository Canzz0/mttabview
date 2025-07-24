import React, {  useRef, useState } from 'react';
import type { TextStyle } from 'react-native';
import { Animated, Dimensions, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface TabItem {
   key: string;
   component:any }
 
 interface MtabProps {
   data: TabItem[];
   linestyle?:TextStyle;
   textstyle?:TextStyle
 }
function Mttab({ data,linestyle,textstyle}: MtabProps){
   const scrollX = useRef(new Animated.Value(0)).current;
   const underlineLeft = useRef(new Animated.Value(0)).current; 
   const [selectedIndex, setSelectedIndex] = useState(0);
   const flatListRef = useRef<FlatList>(null);
   const screenWidth = Dimensions.get('window').width;
   const headerScrollRef = useRef<ScrollView>(null);
   const tabLayouts = useRef<{ x: number; width: number }[]>([]);
   const [isUnderlineInit, setIsUnderlineInit] = useState(false);
   const [tabWidths, setTabWidths] = useState<number[]>([]);
   const [useFullWidth, setUseFullWidth] = useState(false);
   const tabOffsets = React.useMemo(() => {
     let offsets = [0];
     if (tabWidths && Array.isArray(tabWidths)) {
       for (let i = 0; i < tabWidths.length; i++) {
        offsets[i + 1] = (offsets[i] ?? 0) + (tabWidths[i] ?? 0);
             }
     }
     return offsets;
   }, [tabWidths]);
   const renderItem = React.useCallback(({ item }: { item: { key: string; component: JSX.Element } }) => (
     <View style={{paddingHorizontal:10,width:screenWidth}}>
       {item.component}
     </View>
   ), [selectedIndex]);
 
 
  
   const handleTabPress = React.useCallback((index: number) => {
    setSelectedIndex(index);
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true
    });

    const layout = tabLayouts.current[index];
    if (layout) {
      const scrollToX = layout.x + layout.width / 2 - screenWidth / 2;
      headerScrollRef.current?.scrollTo({
        x: Math.max(0, scrollToX),
        animated: true
      });
    }
 }, []);
 
   const handleMomentumScrollEnd = React.useCallback((event: any) => {
     const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
     setSelectedIndex(newIndex);

   }, []);
 
   
   return(
    <>
     <View >
       <ScrollView
       style={{marginBottom:15}}
         ref={headerScrollRef}
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.headerScrollView}
       >
         <View style={styles.view}>
           {data.map((item: { key: string }, index: number) => (
             <TouchableOpacity
               key={`${item.key}`}
               onPress={() => handleTabPress(index)}
               style={[styles.tabItem, useFullWidth ? { width: screenWidth / data.length } : {}]}
               onLayout={e => {
                 const { x, width } = e.nativeEvent.layout;
                 tabLayouts.current[index] = { x, width };
                 if (index === 0 && !isUnderlineInit) {
                   underlineLeft.setValue(x);
                   setIsUnderlineInit(true);
                 }
                 setTabWidths(prev => {
                   const newWidths = [...prev];
                   newWidths[index] = width;
                   if (newWidths.filter(Boolean).length === data.length) {
                     const total = newWidths.reduce((a, b) => a + b, 0);
                     setUseFullWidth(total < screenWidth);
                   }
                   return newWidths;
                 });
               }}
             >
               <Animated.Text
                 style={[
                   styles.headerText,
                   textstyle,
                 ]}
               >
                 {item.key}
               </Animated.Text>
             </TouchableOpacity>
           ))}
         </View>
         
         <Animated.View 
           style={[
             styles.underline,
             linestyle,
             useFullWidth
               ? {
                   left: scrollX.interpolate({
                     inputRange: data.map((_, i) => i * screenWidth),
                     outputRange: data.map((_, i) => i * (screenWidth / data.length)),
                   }),
                   width: screenWidth / data.length,
                 }
               : tabWidths.length === data.length
                 ? {
                     left: scrollX.interpolate({
                       inputRange: data.map((_, i) => i * screenWidth),
                       outputRange: tabOffsets.slice(0, -1),
                     }),
                     width: scrollX.interpolate({
                       inputRange: data.map((_, i) => i * screenWidth),
                       outputRange: tabWidths,
                     }),
                   }
                 : {},
           ]}
         />
       </ScrollView>
     </View>

     <FlatList 
       ref={flatListRef}
       data={data}
       renderItem={renderItem}
       horizontal
       pagingEnabled
       showsHorizontalScrollIndicator={false}
       onMomentumScrollEnd={handleMomentumScrollEnd}
       onScroll={Animated.event(
         [{ nativeEvent: { contentOffset: { x: scrollX } } }],
         { useNativeDriver: false }
       )}
       scrollEventThrottle={16}
       decelerationRate="fast"
       initialNumToRender={1}
     />
    </>
 )
}

export { Mttab };

const styles = StyleSheet.create({

  view: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#666',
  },
 
  underline: {
    top:35,
    left:0,
    height: 2,
    backgroundColor: '#367CBA',
    position: 'absolute',
    bottom: 20,
    flex:1
  },
  headerScrollView: {
    flexGrow: 1,
  },
});