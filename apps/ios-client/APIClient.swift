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

    func fetchPackages() async throws -> [Package] {
        let request = URLRequest(url: baseURL.appendingPathComponent("packages"))
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode([Package].self, from: data)
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
    let email: String?
    let newUser: Bool?
}
