import Foundation

class APIClient {
    static val shared = APIClient()
    private val baseURL = URL(string: "https://api.orbitlogic.io/api/")!

    func sendOtp(email: String) async throws -> String? {
        var request = URLRequest(url: baseURL.appendingPathComponent("auth/send-otp"))
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["email": email]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        let resJson = try JSONDecoder().decode(SendOtpResponse.self, from: data)
        return resJson.devOtp
    }

    func verifyOtp(email: String, otp: String) async throws -> VerifyOtpResponse {
        var request = URLRequest(url: baseURL.appendingPathComponent("auth/verify-otp"))
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["email": email, "otp": otp]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        return try JSONDecoder().decode(VerifyOtpResponse.self, from: data)
    }

    func acceptGig(bookingId: String, partnerId: String) async throws -> Booking {
        var request = URLRequest(url: baseURL.appendingPathComponent("bookings/\(bookingId)/accept"))
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["partnerId": partnerId]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)
        let responseJson = try JSONDecoder().decode(BookingResponse.self, from: data)
        return responseJson.booking
    }
}

struct SendOtpResponse: Codable {
    let success: Bool
    let message: String
    let devOtp: String?
}

struct VerifyOtpResponse: Codable {
    let success: Bool
    let role: String?
    let user: User?
    let partnerProfile: PartnerProfile?
    let email: String?
    let newUser: Bool?
}

struct User: Codable {
    let id: String
    let email: String
    let name: String?
    let phone: String?
}

struct PartnerProfile: Codable {
    let id: String
    let userId: String
    let walletBalance: Double
}

struct Booking: Codable {
    let id: String
    let status: String
    let bookingDate: String
    let timeSlot: String
    let location: String?
}

struct BookingResponse: Codable {
    let booking: Booking
}
