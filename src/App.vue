<template>
  <router-view />
</template>

<script setup lang="ts">
import chalk from 'chalk';

// 渐变的颜色数组
const fieryColors = [
    chalk.hex('#c2410c'),
    chalk.hex('#ea580c'),
    chalk.hex('#fb923c'),
    chalk.hex('#fdba74'),
    chalk.hex('#fed7aa'),
];

// 原始 ASCII 艺术
const asciiArt = `

     ____  ___)                          _    ______      __       __)            
    (, /   /         /)        //       '  ) (, /    )   (, )  |  /        /)  /) 
      /---/      ___(/       ___ _       -(    /    /       | /| / _____  // _(/  
   ) /   (__(_(_(_) / )_(_(_(_) /_)_  (__ )  _/___ /_       |/ |/ (_)/ (_(/_(_(_  
  (_/                                      (_/___ /         /  |                  
                                                                                  
`;

// 将 ASCII 艺术按行分割，并应用渐变颜色
const lines = asciiArt.trim().split('\n');
const coloredLines = lines.map((line, index) => {
    const colorIndex = index % fieryColors.length; // 循环使用颜色
    return fieryColors[colorIndex](line);
});

// 打印带有火焰渐变的 ASCII 艺术
console.log(coloredLines.join('\n'));
</script>
