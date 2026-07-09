package io.orbitlogic.client.ui.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.orbitlogic.client.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuthScreen(
    onLoginSuccess: (email: String) -> Unit
) {
    var email by remember { mutableStateOf("") }
    var otpCode by remember { mutableStateOf("") }
    var isOtpSent by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var mockOtpMessage by remember { mutableStateOf<String?>(null) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Logo Icon & Header
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .background(
                        brush = Brush.linearGradient(listOf(ClientCyan, ClientPurple)),
                        shape = RoundedCornerShape(16.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "O",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "ORBIT",
                fontSize = 28.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.5.sp,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Professional Cinema. Delivered in 60 Minutes.",
                fontSize = 12.sp,
                color = TextSecondary,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(48.dp))

            if (!isOtpSent) {
                // Email Auth Input
                TextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address", color = TextSecondary) },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = DarkSurface,
                        unfocusedContainerColor = DarkSurface,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = ClientCyan
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, BorderColor, RoundedCornerShape(12.dp)),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        if (email.contains("@")) {
                            isLoading = true
                            isOtpSent = true
                            mockOtpMessage = "Mock OTP: 123456"
                            isLoading = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ClientCyan),
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Continue with Email", fontWeight = FontWeight.Bold, color = Color.Black)
                }

                Spacer(modifier = Modifier.height(24.dp))
                Text("OR", color = TextSecondary, fontSize = 11.sp)
                Spacer(modifier = Modifier.height(24.dp))

                // Social log ins placeholder
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    SocialButton(text = "Google", modifier = Modifier.weight(1f)) {
                        onLoginSuccess("mock.user@gmail.com")
                    }
                    SocialButton(text = "Apple", modifier = Modifier.weight(1f)) {
                        onLoginSuccess("mock.apple@apple.com")
                    }
                }
            } else {
                // OTP code prompt
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(ClientCyan.copy(alpha = 0.1f), RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.Security, contentDescription = null, tint = ClientCyan)
                }
                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "Check Your Inbox",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "We sent a 6-digit verification code to\n$email",
                    fontSize = 13.sp,
                    color = TextSecondary,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(24.dp))

                mockOtpMessage?.let {
                    Surface(
                        color = ClientCyan.copy(alpha = 0.1f),
                        border = BorderStroke(1.dp, ClientCyan.copy(alpha = 0.3f)),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.padding(bottom = 16.dp)
                    ) {
                        Text(
                            text = it,
                            color = ClientCyan,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                }

                TextField(
                    value = otpCode,
                    onValueChange = { otpCode = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    label = { Text("6-Digit Code", color = TextSecondary) },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = DarkSurface,
                        unfocusedContainerColor = DarkSurface,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = ClientCyan
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, BorderColor, RoundedCornerShape(12.dp)),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        if (otpCode == "123456" || otpCode.length == 6) {
                            onLoginSuccess(email)
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ClientCyan),
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Verify Code", fontWeight = FontWeight.Bold, color = Color.Black)
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Resend Code",
                    color = ClientCyan,
                    fontSize = 13.sp,
                    modifier = Modifier.clickable {
                        mockOtpMessage = "Mock OTP refreshed: 123456"
                    }
                )
            }
        }
    }
}

@Composable
fun SocialButton(text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Box(
        modifier = modifier
            .height(48.dp)
            .background(DarkSurface, RoundedCornerShape(12.dp))
            .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(text = text, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
    }
}
