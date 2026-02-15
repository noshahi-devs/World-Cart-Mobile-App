import React from 'react';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, RadialGradient, Stop, G, Ellipse, Polygon, Polyline } from 'react-native-svg';

// ==================== HOME ICON 3D ====================
export const Home3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="homeRoofGrad_3d" x1="32" y1="4" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={focused ? "#3498db" : "#bdc3c7"} />
                    <Stop offset="1" stopColor={focused ? "#2980b9" : "#95a5a6"} />
                </LinearGradient>
                <LinearGradient id="homeWallGrad_3d" x1="16" y1="28" x2="16" y2="58" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={focused ? "#ecf0f1" : "#ecf0f1"} />
                    <Stop offset="1" stopColor={focused ? "#bdc3c7" : "#bdc3c7"} />
                </LinearGradient>
                <LinearGradient id="homeDoorGrad_3d" x1="32" y1="36" x2="32" y2="58">
                    <Stop offset="0" stopColor="#34495e" />
                    <Stop offset="1" stopColor="#2c3e50" />
                </LinearGradient>
                <RadialGradient id="homeShadow_3d" cx="32" cy="58" rx="24" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Shadow */}
            <Ellipse cx="32" cy="58" rx="24" ry="6" fill="url(#homeShadow_3d)" />

            {/* Base/Walls */}
            <Path d="M12 30 H52 V54 C52 56.2 50.2 58 48 58 H16 C13.8 58 12 56.2 12 54 V30 Z" fill="url(#homeWallGrad_3d)" />

            {/* Door */}
            <Path d="M26 42 H38 V58 H26 V42 Z" fill="url(#homeDoorGrad_3d)" />
            <Circle cx="36" cy="50" r="1" fill="#f1c40f" />

            {/* Roof - Overhanging */}
            <Path
                d="M4 32 L32 4 L60 32 L56 36 L32 12 L8 36 Z"
                fill="url(#homeRoofGrad_3d)"
                stroke={focused ? "#1f618d" : "#7f8c8d"}
                strokeWidth="1"
                strokeLinejoin="round"
            />
            {/* Inner Roof Fill (to cover top of walls) */}
            <Path d="M8 32 L32 8 L56 32" fill="url(#homeRoofGrad_3d)" />

            {/* Highlight */}
            <Path
                d="M18 24 L32 10 L46 24"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.3"
                strokeLinecap="round"
                fill="none"
            />
        </Svg>
    );
};

// ==================== CART ICON 3D ====================
export const Cart3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="cartBody_3d" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={focused ? "#FEA47F" : "#bdc3c7"} />
                    <Stop offset="1" stopColor={focused ? "#F97F51" : "#95a5a6"} />
                </LinearGradient>
                <RadialGradient id="wheelGrad_3d" cx="16" cy="54" r="8">
                    <Stop offset="0" stopColor="#555" />
                    <Stop offset="1" stopColor="#000" />
                </RadialGradient>
                <RadialGradient id="shadowCart_3d" cx="32" cy="60" rx="24" ry="4">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Shadow */}
            <Ellipse cx="32" cy="62" rx="24" ry="4" fill="url(#shadowCart_3d)" />

            {/* Handle/Frame - Higher contrast for inactive state */}
            <Path
                d="M4 10 H12 L15 22"
                stroke={focused ? "#2C3A47" : "#95a5a6"}
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Wheels */}
            <Circle cx="20" cy="54" r="5" fill="url(#wheelGrad_3d)" />
            <Circle cx="48" cy="54" r="5" fill="url(#wheelGrad_3d)" />

            {/* Cart Body */}
            <Path
                d="M12 16 H56 L50 44 H18 Z"
                fill="url(#cartBody_3d)"
                stroke={focused ? "white" : "rgba(255,255,255,0.4)"}
                strokeWidth="1"
            />

            {/* Decorative Dots/Items */}
            <Circle cx="28" cy="12" r="6" fill="#55E6C1" />
            <Circle cx="40" cy="10" r="7" fill="#F8EFBA" />
            <Circle cx="34" cy="14" r="5" fill="#D6A2E8" />
        </Svg>
    );
};

// ==================== PROFILE ICON 3D ====================
export const Profile3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <RadialGradient id="headGrad_3d" cx="32" cy="22" r="14" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.3" stopColor={focused ? "#1B9CFC" : "#bdc3c7"} />
                    <Stop offset="1" stopColor={focused ? "#182C61" : "#95a5a6"} />
                </RadialGradient>
                <LinearGradient id="bodyGrad_3d" x1="32" y1="36" x2="32" y2="64" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={focused ? "#55E6C1" : "#ecf0f1"} />
                    <Stop offset="1" stopColor={focused ? "#58B19F" : "#bdc3c7"} />
                </LinearGradient>
                <RadialGradient id="shadowProfile_3d" cx="32" cy="62" rx="18" ry="4">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.25" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="62" rx="18" ry="4" fill="url(#shadowProfile_3d)" />
            <Path d="M14 60 C14 46, 50 46, 50 60 L14 60 Z" fill="url(#bodyGrad_3d)" />
            <Circle cx="32" cy="24" r="12" fill="url(#headGrad_3d)" />
            <Ellipse cx="28" cy="18" rx="3" ry="2" fill="white" fillOpacity="0.6" transform="rotate(-45, 28, 18)" />
        </Svg>
    );
};

// ==================== SEARCH / EXPLORE ICON 3D ====================
export const Search3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                {/* Glass Lens Gradient - Blueish clear */}
                <RadialGradient id="glassGrad" cx="24" cy="24" r="22">
                    <Stop offset="0.6" stopColor="#E0F7FA" stopOpacity="0.3" />
                    <Stop offset="1" stopColor="#B2EBF2" stopOpacity="0.6" />
                </RadialGradient>
                {/* Metallic Rim */}
                <LinearGradient id="rimGrad" x1="10" y1="10" x2="40" y2="40">
                    <Stop offset="0" stopColor="#95a5a6" />
                    <Stop offset="0.5" stopColor="#ecf0f1" />
                    <Stop offset="1" stopColor="#7f8c8d" />
                </LinearGradient>
                {/* Handle - Dark Grey/Black Professional */}
                <LinearGradient id="handleGrad" x1="40" y1="40" x2="60" y2="60">
                    <Stop offset="0" stopColor="#34495e" />
                    <Stop offset="1" stopColor="#2c3e50" />
                </LinearGradient>
                <RadialGradient id="magShadow" cx="36" cy="60" rx="18" ry="5">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Shadow */}
            <Ellipse cx="36" cy="60" rx="18" ry="5" fill="url(#magShadow)" />

            {/* Handle */}
            <Path
                d="M42 42 L58 58"
                stroke="url(#handleGrad)"
                strokeWidth="10"
                strokeLinecap="round"
            />

            {/* Rim or Frame */}
            <Circle cx="26" cy="26" r="20" stroke="url(#rimGrad)" strokeWidth="4" fill="none" />

            {/* Glass Lens */}
            <Circle cx="26" cy="26" r="18" fill="url(#glassGrad)" />

            {/* Reflection / Glint */}
            <Path
                d="M16 18 Q 24 10, 34 18"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeOpacity="0.7"
                fill="none"
            />
            {/* Secondary Glint */}
            <Circle cx="34" cy="34" r="2" fill="white" fillOpacity="0.5" />
        </Svg>
    );
};

// ==================== HEART / WISHLIST ICON 3D ====================
export const Heart3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <RadialGradient id="heartGrad" cx="20" cy="20" r="30" gradientUnits="userSpaceOnUse">
                    {/* Focus: Vibrant Red | Unfocus: Premium Soft Rose */}
                    <Stop offset="0" stopColor={focused ? "#d8b1b8ff" : "#f0ccd8ff"} />
                    <Stop offset="1" stopColor={focused ? "#c4001d" : "#df7695ff"} />
                </RadialGradient>
                <RadialGradient id="heartShadow" cx="32" cy="58" rx="14" ry="4">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="14" ry="4" fill="url(#heartShadow)" />
            <Path
                d="M32 54 C32 54, 58 38, 58 24 C58 14, 50 8, 42 8 C36 8, 32 14, 32 14 C32 14, 28 8, 22 8 C14 8, 6 14, 6 24 C6 38, 32 54, 32 54 Z"
                fill="url(#heartGrad)"
            />
            {/* Glossy Reflection */}
            <Path
                d="M14 18 Q 20 12, 26 18"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeOpacity={focused ? 0.6 : 0.4}
                fill="none"
            />
        </Svg>
    );
};

// ==================== ARROW LEFT ICON 3D ====================
export const ArrowLeft3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="arrowLeftGrad" x1="0" y1="0" x2="64" y2="64">
                    {/* Deep Slate / Premium Dark */}
                    <Stop offset="0" stopColor="#4b6584" />
                    <Stop offset="1" stopColor="#2d3436" />
                </LinearGradient>
                <RadialGradient id="arrowLeftShadow" cx="32" cy="60" rx="20" ry="5">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            <Ellipse cx="32" cy="62" rx="20" ry="5" fill="url(#arrowLeftShadow)" />

            {/* 3D Extrusion Effect (Shadow layer) */}
            <Path
                d="M44 14 L24 32 L44 50"
                stroke="#1e272e"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(0, 3)"
            />

            {/* Main Premium Chevron */}
            <Path
                d="M44 14 L24 32 L44 50"
                stroke="url(#arrowLeftGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Sharp Highlight for 3D Feel */}
            <Path
                d="M44 14 L24 32 L44 50"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.3"
                transform="translate(1, -1)"
            />
        </Svg>
    );
};

// ==================== TRASH ICON 3D ====================
export const Trash3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="trashCanGrad" x1="10" y1="0" x2="50" y2="0">
                    <Stop offset="0" stopColor="#ff4d4d" />
                    <Stop offset="1" stopColor="#b33939" />
                </LinearGradient>
                <LinearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="20">
                    <Stop offset="0" stopColor="#ff7979" />
                    <Stop offset="1" stopColor="#eb4d4b" />
                </LinearGradient>
                <RadialGradient id="trashShadow" cx="32" cy="60" rx="14" ry="4">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="60" rx="14" ry="4" fill="url(#trashShadow)" />
            <Path d="M18 20 L22 56 H42 L46 20 Z" fill="url(#trashCanGrad)" />
            <Path d="M14 14 H50 V20 H14 Z" fill="url(#lidGrad)" rx="2" />
            <Path d="M26 10 H38 V14 H26 Z" fill="url(#lidGrad)" />
            <Path d="M26 26 V50 M32 26 V50 M38 26 V50" stroke="#7d2626" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
        </Svg>
    );
};

// ==================== PACKAGE ICON 3D ====================
export const Package3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="boxFront" x1="0" y1="0" x2="0" y2="64">
                    <Stop offset="0" stopColor="#F8EFBA" />
                    <Stop offset="1" stopColor="#E58E26" />
                </LinearGradient>
                <LinearGradient id="boxTop" x1="0" y1="0" x2="0" y2="64">
                    <Stop offset="0" stopColor="#FECA57" />
                    <Stop offset="1" stopColor="#F8C291" />
                </LinearGradient>
                <LinearGradient id="boxSide" x1="0" y1="0" x2="64" y2="0">
                    <Stop offset="0" stopColor="#E58E26" />
                    <Stop offset="1" stopColor="#B76E18" />
                </LinearGradient>
                <RadialGradient id="boxShadow" cx="32" cy="62" rx="20" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="62" rx="20" ry="6" fill="url(#boxShadow)" />
            <Path d="M32 4 L60 20 L32 36 L4 20 Z" fill="url(#boxTop)" />
            <Path d="M4 20 L32 36 V60 L4 44 Z" fill="url(#boxFront)" />
            <Path d="M60 20 L60 44 L32 60 V36 Z" fill="url(#boxSide)" />
            <Path d="M32 4 L32 36 M4 20 L60 20" stroke="#D35400" strokeWidth="1" strokeOpacity="0.5" />
        </Svg>
    );
};

// ==================== MAP MARKER ICON 3D ====================
export const MapMarker3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <RadialGradient id="pinGrad" cx="32" cy="24" r="22" fx="24" fy="16">
                    <Stop offset="0.2" stopColor={focused ? "#ff7979" : "#ff9f43"} />
                    <Stop offset="1" stopColor={focused ? "#eb2f06" : "#ee5253"} />
                </RadialGradient>
                <RadialGradient id="pinShadow" cx="32" cy="60" rx="8" ry="3">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.3" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="60" rx="8" ry="3" fill="url(#pinShadow)" />
            <Path d="M32 2 C18 2, 8 12, 8 26 C8 42, 32 62, 32 62 C32 62, 56 42, 56 26 C56 12, 46 2, 32 2 Z" fill="url(#pinGrad)" />
            <Circle cx="32" cy="26" r="8" fill="#fff" fillOpacity="0.9" />
        </Svg>
    );
};

// ==================== CREDIT CARD ICON 3D ====================
export const CreditCard3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="cardGrad" x1="0" y1="0" x2="64" y2="64">
                    <Stop offset="0" stopColor="#a55eea" />
                    <Stop offset="1" stopColor="#4b7bec" />
                </LinearGradient>
                <RadialGradient id="cardShadow" cx="32" cy="58" rx="26" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="26" ry="6" fill="url(#cardShadow)" />
            <Rect x="4" y="16" width="56" height="36" rx="6" fill="url(#cardGrad)" transform="rotate(-5, 32, 32)" />
            <Rect x="10" y="34" width="10" height="8" rx="2" fill="#f1c40f" transform="rotate(-5, 32, 32)" />
            <Rect x="4" y="24" width="56" height="6" fill="#333" transform="rotate(-5, 32, 32)" />
        </Svg>
    );
};

// ==================== CROWN ICON 3D ====================
export const Crown3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="crownGrad" x1="32" y1="10" x2="32" y2="50">
                    <Stop offset="0" stopColor="#f1c40f" />
                    <Stop offset="1" stopColor="#f39c12" />
                </LinearGradient>
            </Defs>
            <Path d="M8 50 H56 V54 H8 V50 Z M8 18 L18 30 L32 10 L46 30 L56 18 V46 H8 V18 Z" fill="url(#crownGrad)" stroke="#e67e22" strokeWidth="2" strokeLinejoin="round" />
            <Circle cx="8" cy="18" r="3" fill="#e74c3c" />
            <Circle cx="32" cy="10" r="3" fill="#e74c3c" />
            <Circle cx="56" cy="18" r="3" fill="#e74c3c" />
        </Svg>
    );
};

// ==================== PLUS ICON 3D ====================
export const Plus3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="plusGrad" x1="0" y1="0" x2="64" y2="64">
                    <Stop offset="0" stopColor="#2ecc71" />
                    <Stop offset="1" stopColor="#27ae60" />
                </LinearGradient>
                <RadialGradient id="plusShadow" cx="32" cy="58" rx="20" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="20" ry="6" fill="url(#plusShadow)" />
            <Circle cx="32" cy="32" r="28" fill="url(#plusGrad)" />
            <Rect x="26" y="12" width="12" height="40" rx="6" fill="white" />
            <Rect x="12" y="26" width="40" height="12" rx="6" fill="white" />
        </Svg>
    );
};

// ==================== MINUS ICON 3D ====================
export const Minus3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="minusGrad" x1="0" y1="0" x2="64" y2="64">
                    <Stop offset="0" stopColor="#e74c3c" />
                    <Stop offset="1" stopColor="#c0392b" />
                </LinearGradient>
                <RadialGradient id="minusShadow" cx="32" cy="58" rx="20" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="20" ry="6" fill="url(#minusShadow)" />
            <Circle cx="32" cy="32" r="28" fill="url(#minusGrad)" />
            <Rect x="12" y="26" width="40" height="12" rx="6" fill="white" />
        </Svg>
    );
};

// ==================== CHECK ICON 3D ====================
export const Check3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="checkGrad" x1="0" y1="0" x2="64" y2="64">
                    <Stop offset="0" stopColor="#20bf6b" />
                    <Stop offset="1" stopColor="#0fb9b1" />
                </LinearGradient>
            </Defs>
            <Circle cx="32" cy="32" r="28" fill="url(#checkGrad)" />
            <Polyline points="16 32 28 44 48 20" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};

// ==================== SHIELD CHECK ICON 3D (PRO) ====================
export const ShieldCheck3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="shieldGrad" x1="32" y1="4" x2="32" y2="56">
                    {/* Vibrant Success Green */}
                    <Stop offset="0" stopColor="#2ecc71" />
                    <Stop offset="1" stopColor="#27ae60" />
                </LinearGradient>
                <LinearGradient id="shieldBorder" x1="32" y1="4" x2="32" y2="56">
                    <Stop offset="0" stopColor="#ffffff" stopOpacity="0.8" />
                    <Stop offset="1" stopColor="#ffffff" stopOpacity="0.3" />
                </LinearGradient>
                <RadialGradient id="shieldShadow" cx="32" cy="60" rx="20" ry="5">
                    <Stop offset="0" stopColor="#27ae60" stopOpacity="0.3" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            <Ellipse cx="32" cy="62" rx="20" ry="5" fill="url(#shieldShadow)" />

            {/* Shield Shape */}
            <Path
                d="M32 4 C32 4, 10 12, 10 28 C10 44, 32 58, 32 58 C32 58, 54 44, 54 28 C54 12, 32 4, 32 4"
                fill="url(#shieldGrad)"
                stroke="url(#shieldBorder)"
                strokeWidth="2"
            />

            {/* 3D Inner Detail */}
            <Path
                d="M32 8 C32 8, 14 15, 14 28 C14 40, 32 52, 32 52 C32 52, 50 40, 50 28 C50 15, 32 8, 32 8"
                fill="white"
                fillOpacity="0.15"
            />

            {/* Checkmark */}
            <Path
                d="M22 30 L30 38 L44 24"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Highlight Shine */}
            <Path
                d="M20 18 C25 12, 39 12, 44 18"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeLinecap="round"
            />
        </Svg>
    );
};

// ==================== STAR ICON 3D ====================
export const Star3D = ({ size = 30, focused, color }) => { // Color prop for rating
    const isGold = color === '#FFD700' || color === 'gold';
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id={isGold ? "starGradGold" : "starGradGray"} x1="32" y1="0" x2="32" y2="64">
                    <Stop offset="0" stopColor={isGold ? "#f1c40f" : "#dcdcdc"} />
                    <Stop offset="1" stopColor={isGold ? "#f39c12" : "#999"} />
                </LinearGradient>
                <RadialGradient id="starShadow" cx="32" cy="58" rx="16" ry="4">
                    <Stop offset="0" stopColor="#000" stopOpacity={isGold ? 0.3 : 0.1} />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="16" ry="4" fill="url(#starShadow)" />
            <Path
                d="M32 4 L40 24 L60 26 L44 40 L48 60 L32 50 L16 60 L20 40 L4 26 L24 24 Z"
                fill={`url(#${isGold ? "starGradGold" : "starGradGray"})`}
                stroke={isGold ? "#e67e22" : "#888"}
                strokeWidth="1"
            />
            <Path
                d="M32 4 L40 24 L24 24 Z"
                fill="white"
                fillOpacity="0.4"
            />
        </Svg>
    );
};

// ==================== CLOSE ICON 3D ====================
export const Close3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="closeGrad" x1="0" y1="0" x2="64" y2="64">
                    <Stop offset="0" stopColor="#e74c3c" />
                    <Stop offset="1" stopColor="#c0392b" />
                </LinearGradient>
                <RadialGradient id="closeShadow" cx="32" cy="58" rx="20" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="20" ry="6" fill="url(#closeShadow)" />
            <Circle cx="32" cy="32" r="28" fill="url(#closeGrad)" />
            <Path d="M20 20 L44 44 M44 20 L20 44" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </Svg>
    );
};

// ==================== EASY FINORA ICON 3D ====================
export const EasyFinora3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="efGrad" x1="0" y1="0" x2="0" y2="64">
                    <Stop offset="0" stopColor="#2ecc71" />
                    <Stop offset="1" stopColor="#27ae60" />
                </LinearGradient>
                <RadialGradient id="efShadow" cx="32" cy="58" rx="20" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="20" ry="6" fill="url(#efShadow)" />
            {/* Green Card Base */}
            <Rect x="8" y="10" width="48" height="44" rx="12" fill="url(#efGrad)" />

            {/* Wallet Icon White */}
            <Rect x="20" y="24" width="24" height="18" rx="3" fill="white" />
            <Path d="M20 28 H44" stroke="#bdc3c7" strokeWidth="1" opacity="0.5" />
            <Circle cx="38" cy="33" r="2" fill="#27ae60" />
        </Svg>
    );
};

// ==================== PAYPAL ICON 3D ====================
export const PayPal3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="ppCardGrad" x1="0" y1="0" x2="64" y2="64">
                    <Stop offset="0" stopColor="#f8f9fa" />
                    <Stop offset="0.5" stopColor="#e9ecef" />
                    <Stop offset="1" stopColor="#dee2e6" />
                </LinearGradient>
                <LinearGradient id="ppGloss" x1="0" y1="0" x2="64" y2="0">
                    <Stop offset="0" stopColor="white" stopOpacity="0.5" />
                    <Stop offset="0.5" stopColor="white" stopOpacity="0" />
                    <Stop offset="1" stopColor="white" stopOpacity="0.2" />
                </LinearGradient>
                <RadialGradient id="ppShadow" cx="32" cy="58" rx="20" ry="4">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.15" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="20" ry="4" fill="url(#ppShadow)" />

            {/* Glassy Card Base */}
            <Rect x="8" y="8" width="48" height="48" rx="14" fill="url(#ppCardGrad)" stroke="#adb5bd" strokeWidth="0.5" />
            <Rect x="8" y="8" width="48" height="48" rx="14" fill="url(#ppGloss)" />

            {/* PayPal Logo (Ps) */}
            <G transform="translate(18, 16) scale(0.8)">
                {/* Back P (Darker Blue) */}
                <Path
                    d="M10 2 L26 2 C32 2 34 6 32 12 C30 18 26 22 18 22 H12 L9 42 H1 L4 2 Z"
                    fill="#002187"
                />
                {/* Front P (Light Blue) */}
                <Path
                    d="M17 14 L33 14 C39 14 41 18 39 24 C37 30 33 34 25 34 H19 L16 54 H8 L11 14 Z"
                    fill="#009cde"
                />
            </G>
        </Svg>
    );
};

// ==================== GOOGLE PAY ICON 3D ====================
export const GooglePay3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                {/* Side Shadows for Extrusion */}
                <LinearGradient id="extRed" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#B23121" />
                    <Stop offset="1" stopColor="#8E271A" />
                </LinearGradient>
                <LinearGradient id="extYellow" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#C28D04" />
                    <Stop offset="1" stopColor="#A47703" />
                </LinearGradient>
                <LinearGradient id="extGreen" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#257D3E" />
                    <Stop offset="1" stopColor="#1B5E2E" />
                </LinearGradient>
                <LinearGradient id="extBlue" x1="1" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#3166BC" />
                    <Stop offset="1" stopColor="#254E8E" />
                </LinearGradient>
                <RadialGradient id="gShadow3D" cx="32" cy="58" rx="24" ry="6">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.25" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Soft Shadow */}
            <Ellipse cx="32" cy="58" rx="24" ry="6" fill="url(#gShadow3D)" />

            <G transform="translate(4, 2) scale(0.85)">
                {/* 3D Extrusion Faces (Sides) */}
                <Path d="M48 10 C38 4 24 4 14 10 L10 16 C22 8 38 8 52 16 Z" fill="url(#extRed)" />
                <Path d="M14 10 L10 16 L10 44 L14 50 C8 38 8 22 14 10 Z" fill="url(#extYellow)" />
                <Path d="M14 50 L10 44 C22 56 38 56 50 48 L54 54 C38 64 22 62 14 50 Z" fill="url(#extGreen)" />
                <Path d="M54 54 L50 48 L50 32 L32 32 L32 26 L56 26 L56 54 Z" fill="url(#extBlue)" />

                {/* Front Faces */}
                <Path d="M32 12 C41 12 49 15 55 21 L64 12 C55 4 44 0 32 0 C20 0 9 7 3 17 L12 24 C16 17 23 12 32 12 Z" fill="#EA4335" />
                <Path d="M12 24 C10 29 9 34 9 40 C9 46 10 51 12 56 L3 67 C1 59 0 50 0 40 C0 30 1 20 5 12 L12 24 Z" fill="#FBBC05" />
                <Path d="M32 68 C44 68 55 64 64 56 L55 47 C49 53 41 56 32 56 C23 56 16 51 12 44 L3 53 C9 63 20 68 32 68 Z" fill="#34A853" />
                <Path d="M64 40 C64 37 63 34 63 31 L32 31 V43 H50 C49 48 46 52 42 55 L51 64 C59 58 64 50 64 40 Z" fill="#4285F4" />

                {/* Gloss/Reflections */}
                <Path d="M32 4 C40 4 48 6 54 10" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
                <Path d="M8 20 Q4 32 8 44" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
            </G>
        </Svg>
    );
};

// ==================== BANK TRANSFER ICON 3D ====================
export const BankTransfer3D = ({ size = 30, focused }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="bankGrad" x1="32" y1="10" x2="32" y2="54">
                    <Stop offset="0" stopColor="#95a5a6" />
                    <Stop offset="1" stopColor="#7f8c8d" />
                </LinearGradient>
                <RadialGradient id="bankShadow" cx="32" cy="58" rx="24" ry="4">
                    <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Ellipse cx="32" cy="58" rx="24" ry="4" fill="url(#bankShadow)" />
            <Rect x="8" y="50" width="48" height="4" fill="#34495e" />
            <Rect x="12" y="46" width="40" height="4" fill="#7f8c8d" />
            <Rect x="14" y="24" width="6" height="22" fill="url(#bankGrad)" />
            <Rect x="24" y="24" width="6" height="22" fill="url(#bankGrad)" />
            <Rect x="34" y="24" width="6" height="22" fill="url(#bankGrad)" />
            <Rect x="44" y="24" width="6" height="22" fill="url(#bankGrad)" />
            <Path d="M32 4 L60 24 H4 Z" fill="url(#bankGrad)" stroke="#bdc3c7" strokeWidth="1" />
        </Svg>
    );
};
// ==================== LOGOUT ICON 3D ====================
export const Logout3D = ({ size = 30, focused, variant = 'default' }) => {
    const isWhite = variant === 'white';
    const mainColor = isWhite ? "#ffffff" : "#ff4757";
    const secondaryColor = isWhite ? "#f1f2f6" : "#ff6b81";
    const frameColor = isWhite ? "rgba(255,255,255,0.8)" : "#747d8c";
    const extrusionColor = isWhite ? "rgba(255,255,255,0.5)" : "#ced6e0";

    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Defs>
                <LinearGradient id="logoutGrad" x1="0" y1="0" x2="64" y2="64">
                    <Stop offset="0" stopColor={mainColor} />
                    <Stop offset="1" stopColor={secondaryColor} />
                </LinearGradient>
                <RadialGradient id="logoutShadow" cx="32" cy="62" rx="20" ry="5">
                    <Stop offset="0" stopColor="#000" stopOpacity={isWhite ? 0.1 : 0.2} />
                    <Stop offset="1" stopColor="#000" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {!isWhite && <Ellipse cx="32" cy="62" rx="20" ry="5" fill="url(#logoutShadow)" />}

            {/* Door Frame (3D Effect) */}
            <Path
                d="M40 10 H14 V54 H40"
                stroke={frameColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Arrow Side (Extrusion) */}
            <Path
                d="M30 32 H54 M54 32 L44 22 M54 32 L44 42"
                stroke={extrusionColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(0, 2)"
            />

            {/* Main Arrow */}
            <Path
                d="M30 32 H54 M54 32 L44 22 M54 32 L44 42"
                stroke="url(#logoutGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Shine Highlight */}
            <Path
                d="M34 28 H50"
                stroke="white"
                strokeWidth="2"
                strokeOpacity={isWhite ? 0.6 : 0.4}
                strokeLinecap="round"
            />
        </Svg>
    );
};
