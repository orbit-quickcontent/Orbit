import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let name: String?
    let phone: String?
    let location: String?
    let role: String
    let brandLogo: String?
    let brandFont: String?
    let brandColor: String?
    let editorRequirements: String?
}

struct Package: Codable, Identifiable {
    let id: String
    let name: String
    let tier: String
    let price: Int
    let focus: String
    let deliveryTime: String
    let features: [String]
    let popular: Bool
}

struct Booking: Codable, Identifiable {
    let id: String
    let userId: String
    let packageId: String
    let partnerId: String?
    let status: String
    let paymentStatus: String
    let bookingDate: String
    let timeSlot: String
    let location: String?
    let notes: String?
    val syncPercentage: Int?
    val footageUrls: [String]?
    val masterReelUrl: String?
    val user: User?
    val packageInfo: Package?
}
