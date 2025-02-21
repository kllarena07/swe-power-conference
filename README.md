# SWE POWER Conference 2025 App

P.O.W.E.R stands for Professional Opportunities for Women in Engineering and Research. The goal of this conference is to help women in STEM fields improve their "soft" professional skills and interact with working women engineers and researchers. This conference brings together students, alumni, and employers who are women in engineering for a chance to network, learn from each other, and grow together as a community. At the end of the conference, students will gain valuable professional development skills that will help them in their future career, and broaden their awareness of career opportunities.

This GitHub repository is the code for the mobile app that will be used for the event management of the conference.

Created by: [Kieran Llarena](https://www.linkedin.com/in/kllarena07/) (Lead Team Developer) and [Aaron Amano](https://www.linkedin.com/in/aaronamano/)

## Features

In this app, non-admin users will be able to:
- Create and log into their accounts.
- View a live-updating agenda feed for the conference.
- View a live-updating message feed for the conference sent from admin users, which are also recieved by push notification.
- Get themselves checked-into the event and obtain raffle ticket points through the QR code scan feature.

In this app, admin users will be able to:
- Create new messages for the conference that will show up in the messages feed screen and send push notifications to all users.
- Check-in and add raffle ticket points to users through QR code scanning on the camera feature.
- Trigger the process that will select the winner of the SWE 2025 POWER Conference raffle.

## Technologies Used

This app was built using:
- React Native and Expo
- Supabase