import React, { useEffect, useRef, useState } from 'react';
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
   const minTabWidth = 100;
   const tabWidth = Math.max(screenWidth / data.length, minTabWidth);
   const renderItem = React.useCallback(({ item }: { item: { key: string; component: JSX.Element } }) => (
     <View style={{paddingHorizontal:10,width:screenWidth}}>
       {item.component}
     </View>
   ), [selectedIndex]);
 
 
   useEffect(() => {
     Animated.spring(underlineLeft, {
       toValue: (screenWidth / data.length) * selectedIndex,
       useNativeDriver: false,
     }).start();
 
 
   }, [selectedIndex]);
  
   const handleTabPress = React.useCallback((index: number) => {
    setSelectedIndex(index);
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true
    });

    const scrollPosition = index * tabWidth - (screenWidth - tabWidth) / 2;
    headerScrollRef.current?.scrollTo({
      x: Math.max(0, scrollPosition),
      animated: true
    });
 }, [tabWidth]);
 
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
               style={[styles.tabItem, { width: tabWidth }]}
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
             { 
               width: tabWidth,
               transform: [{
                 translateX: scrollX.interpolate({
                   inputRange: data.map((_, i) => i * screenWidth),
                   outputRange: data.map((_, i) => i * tabWidth),
                 })
               }]
             }
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