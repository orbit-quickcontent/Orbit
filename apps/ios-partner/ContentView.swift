import SwiftUI

struct ContentView: View {
    @State private var email = ""
    @State private var otp = ""
    @State private var isOtpSent = false
    @State private var isLoggedIn = false
    @State private var isOnline = false
    @State private var walletBalance: Double = 0.0
    @State private var devOtp: String? = nil

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            if !isLoggedIn {
                VStack(spacing: 20) {
                    Text("ORBIT CREATOR")
                        .font(.custom("PlusJakartaSans-ExtraBold", size: 40))
                        .fontWeight(.black)
                        .foregroundColor(.white)

                    Text("Shoot. Upload. Earn money.")
                        .font(.custom("PlusJakartaSans-Medium", size: 16))
                        .foregroundColor(Color(hex: "4BE277"))

                    Spacer().frame(height: 30)

                    if !isOtpSent {
                        TextField("Creator Email", text: $email)
                            .padding()
                            .background(Color(hex: "121212"))
                            .cornerRadius(12)
                            .foregroundColor(.white)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "1F2937"), lineWidth: 1))
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)

                        Button(action: sendOtp) {
                            Text("Send Verification OTP")
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(12)
                        }
                    } else {
                        TextField("Verification OTP", text: $otp)
                            .padding()
                            .background(Color(hex: "121212"))
                            .cornerRadius(12)
                            .foregroundColor(.white)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "1F2937"), lineWidth: 1))
                            .keyboardType(.numberPad)

                        Button(action: verifyOtp) {
                            Text("Verify and Login")
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(12)
                        }

                        if let code = devOtp {
                            Text("Debug OTP: \(code)")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                }
                .padding(24)
            } else {
                TabView {
                    GigsView(isOnline: $isOnline)
                        .tabItem {
                            Label("Gigs", systemImage: "briefcase.fill")
                        }
                    EarningsView(balance: $walletBalance)
                        .tabItem {
                            Label("Earnings", systemImage: "indianrupeesign.circle.fill")
                        }
                }
                .accentColor(Color(hex: "4BE277"))
            }
        }
    }

    private func sendOtp() {
        Task {
            do {
                let code = try await APIClient.shared.sendOtp(email: email)
                await MainActor.run {
                    self.devOtp = code
                    self.isOtpSent = true
                }
            } catch {
                print("Error: \(error)")
            }
        }
    }

    private func verifyOtp() {
        Task {
            do {
                let res = try await APIClient.shared.verifyOtp(email: email, otp: otp)
                await MainActor.run {
                    if res.success {
                        self.walletBalance = res.partnerProfile?.walletBalance ?? 0.0
                        self.isLoggedIn = true
                    }
                }
            } catch {
                print("Error: \(error)")
            }
        }
    }
}

struct GigsView: View {
    @Binding var isOnline: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Text("ORBIT CREATOR")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                Spacer()
                Toggle(isOn: $isOnline) {
                    Text(isOnline ? "ONLINE" : "OFFLINE")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(isOnline ? Color(hex: "4BE277") : .gray)
                }
                .toggleStyle(SwitchToggleStyle(tint: Color(hex: "4BE277")))
            }
            .padding()

            if !isOnline {
                Spacer()
                Text("Go online to start receiving work dispatches.")
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, alignment: .center)
                Spacer()
            } else {
                // Mock Gig card list with ₹700 payout value visible
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Available Shoots Nearby")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.horizontal)

                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Professional (UGC)")
                                    .font(.title3)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                                Spacer()
                                Text("₹700.00")
                                    .font(.title3)
                                    .fontWeight(.black)
                                    .foregroundColor(Color(hex: "4BE277"))
                            }
                            Text("Location: Bandra West, Mumbai")
                                .foregroundColor(.lightGray)
                            Text("Schedule: 2026-07-20 • 12:00 PM")
                                .font(.caption)
                                .foregroundColor(.gray)

                            HStack(spacing: 12) {
                                Button(action: {}) {
                                    Text("Decline")
                                        .foregroundColor(.white)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "1F2937"), lineWidth: 1))
                                }
                                Button(action: {}) {
                                    Text("Accept Gig")
                                        .fontWeight(.bold)
                                        .foregroundColor(.black)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(Color.white)
                                        .cornerRadius(8)
                                }
                            }
                        }
                        .padding()
                        .background(Color(hex: "121212"))
                        .cornerRadius(16)
                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "1F2937"), lineWidth: 1))
                        .padding(.horizontal)
                    }
                }
            }
        }
        .background(Color.black)
    }
}

struct EarningsView: View {
    @Binding var balance: Double

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Earnings Desk")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white)
                .padding()

            VStack(alignment: .leading, spacing: 16) {
                Text("Wallet Balance")
                    .font(.caption)
                    .foregroundColor(.gray)
                Text("₹\(balance, specifier: "%.2f")")
                    .font(.system(size: 44, weight: .bold))
                    .foregroundColor(Color(hex: "4BE277"))

                Button(action: {}) {
                    Text("Request Withdrawal")
                        .fontWeight(.bold)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.white)
                        .cornerRadius(12)
                }
            }
            .padding()
            .background(Color(hex: "121212"))
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "1F2937"), lineWidth: 1))
            .padding(.horizontal)

            Spacer()
        }
        .background(Color.black)
    }
}

extension Color {
    static val lightGray = Color(hex: "94A3B8")
}
