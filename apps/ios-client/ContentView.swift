import SwiftUI

struct ContentView: View {
    @State private var email = ""
    @State private var otp = ""
    @State private var isOtpSent = false
    @State private var isLoggedIn = false
    @State private var devOtp: String? = nil

    val primaryGradient = LinearGradient(
        colors: [Color(hex: "47D6FF"), Color(hex: "EDB1FF")],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            if !isLoggedIn {
                VStack(spacing: 20) {
                    Text("ORBIT")
                        .font(.custom("Montserrat-Bold", size: 48))
                        .fontWeight(.black)
                        .foregroundColor(.white)

                    Text("Cinematic Reels Delivered Instantly")
                        .font(.custom("PlusJakartaSans-Medium", size: 16))
                        .foregroundColor(Color(hex: "47D6FF"))

                    Spacer().frame(height: 30)

                    if !isOtpSent {
                        TextField("Enter your email", text: $email)
                            .padding()
                            .background(Color(hex: "131313"))
                            .cornerRadius(12)
                            .foregroundColor(.white)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "1F2937"), lineWidth: 1))
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)

                        Button(action: sendOtp) {
                            Text("Send OTP")
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(primaryGradient)
                                .cornerRadius(12)
                        }
                    } else {
                        TextField("6-Digit OTP", text: $otp)
                            .padding()
                            .background(Color(hex: "131313"))
                            .cornerRadius(12)
                            .foregroundColor(.white)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "1F2937"), lineWidth: 1))
                            .keyboardType(.numberPad)

                        Button(action: verifyOtp) {
                            Text("Verify & Continue")
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(primaryGradient)
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
                    FeedView()
                        .tabItem {
                            Label("Home", systemImage: "house.fill")
                        }
                    Text("Packages View")
                        .tabItem {
                            Label("Packages", systemImage: "list.bullet")
                        }
                    Text("Live Tracker")
                        .tabItem {
                            Label("Track", systemImage: "clock.fill")
                        }
                }
                .accentColor(Color(hex: "47D6FF"))
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
                        self.isLoggedIn = true
                    }
                }
            } catch {
                print("Error: \(error)")
            }
        }
    }
}

struct FeedView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Welcome back,")
                    .foregroundColor(.gray)
                Text("Creator Studio")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)

                // Service cards mapping ...
                HStack(spacing: 12) {
                    VStack(alignment: .leading) {
                        Image(systemName: "video.fill")
                            .foregroundColor(Color(hex: "47D6FF"))
                            .font(.title)
                        Spacer()
                        Text("Cinematic Reels")
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, minHeight: 110)
                    .background(Color(hex: "131313"))
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "1F2937"), lineWidth: 1))

                    VStack(alignment: .leading) {
                        Image(systemName: "bolt.fill")
                            .foregroundColor(Color(hex: "47D6FF"))
                            .font(.title)
                        Spacer()
                        Text("Fast Editing")
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, minHeight: 110)
                    .background(Color(hex: "131313"))
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "1F2937"), lineWidth: 1))
                }
            }
            .padding()
        }
        .background(Color.black)
    }
}

extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgbValue: UInt64 = 0
        scanner.scanHexInt64(&rgbValue)
        let r = Double((rgbValue & 0xFF0000) >> 16) / 255.0
        let g = Double((rgbValue & 0x00FF00) >> 8) / 255.0
        let b = Double(rgbValue & 0x0000FF) / 255.0
        self.init(red: r, green: g, blue: b)
    }
}
