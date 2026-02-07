# Solana POS Shadow

A playful Neo-brutalist Solana Point of Sale application built with Next.js 15.

## Overview

Solana POS Shadow is a merchant dashboard for accepting Solana payments. It features a unique Neo-brutalist design with thick black borders, bold typography, and playful animations.

## Features

- **Address Validation**: Enter and validate Solana public addresses
- **Balance Display**: View SOL balance with animated count-up effect
- **Transaction Feed**: Receipt-style list of the last 10 transactions
- **Payment QR Generator**: Create Solana Pay QR codes with preset amounts
- **Playful Animations**: Squishy buttons, wobbly loading spinner, and staggered list animations

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Blockchain**: @solana/web3.js
- **Animations**: framer-motion
- **QR Codes**: qrcode.react

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Lo10Th/bizz-wallet.git
cd bizz-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Mock Data

For testing without connecting to the Solana network, create a `.env.local` file:

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Production Build

```bash
npm run build
npm start
```

## Usage

1. **Enter Address**: On the landing page, enter a valid Solana public address
2. **View Dashboard**: See the merchant dashboard with balance and transactions
3. **Create Payment**: Enter a payment amount to generate a Solana Pay QR code
4. **QR Code**: Show the generated QR code for customers to scan and send payments
5. **Monitor Transactions**: Watch incoming and outgoing transactions in real-time

## Design Philosophy

### Neo-brutalism Aesthetic

- Thick 4px black borders on all elements
- White backgrounds with bold black shadows
- High contrast for clarity
- Bold, rounded sans-serif typography (Fredoka)

### Animations

- **Buttons**: Scale down on click, bounce on hover
- **Balance**: Smooth count-up animation
- **Transactions**: Staggered slide-up effect
- **Loading**: Wobbly, hand-drawn style spinner

## File Structure

```
bizz-wallet/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AddressInput.tsx   # Address input form
│   ├── BalanceCounter.tsx # Animated balance display
│   ├── LoadingSpinner.tsx # Loading animation
│   ├── MerchantDashboard.tsx # Main dashboard
│   ├── QRCodeDisplay.tsx  # QR code generator
│   └── TransactionList.tsx # Transaction feed
└── lib/
    └── solana.ts          # Solana blockchain utilities
```

## License

ISC

## Author

Lo10Th
