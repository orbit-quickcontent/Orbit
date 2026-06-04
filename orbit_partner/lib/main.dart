import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Orbit Partner',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.black,
        primaryColor: const Color(0xFF8A2BE2), // Orbit Purple
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF8A2BE2),
          secondary: Color(0xFF00F0FF), // Orbit Cyan
          surface: Color(0xFF121212),
        ),
        useMaterial3: true,
      ),
      home: const WebViewContainer(),
    );
  }
}

class WebViewContainer extends StatefulWidget {
  const WebViewContainer({super.key});

  @override
  State<WebViewContainer> createState() => _WebViewContainerState();
}

class _WebViewContainerState extends State<WebViewContainer> {
  late final WebViewController _controller;
  String _currentUrl = "http://10.0.2.2:3000/?role=PARTNER";
  bool _isLoading = true;
  double _loadingProgress = 0;
  bool _hasError = false;
  String _errorMessage = "";
  bool _showSettings = false;
  final TextEditingController _urlInputController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadSavedUrl();
  }

  // Load the saved URL from SharedPreferences
  Future<void> _loadSavedUrl() async {
    final prefs = await SharedPreferences.getInstance();
    final savedUrl = prefs.getString('orbit_partner_server_url');
    if (savedUrl != null && savedUrl.isNotEmpty) {
      setState(() {
        _currentUrl = savedUrl;
      });
    }
    _urlInputController.text = _currentUrl;
    _initWebViewController();
  }

  // Save the custom URL to SharedPreferences
  Future<void> _saveUrl(String url) async {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://$url';
    }
    // Ensure role parameter is present
    try {
      final uri = Uri.parse(url);
      if (!uri.queryParameters.containsKey('role')) {
        final separator = uri.query.isEmpty ? '?' : '&';
        url = '$url${separator}role=PARTNER';
      }
    } catch (_) {
      // Fallback in case of parsing error
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('orbit_partner_server_url', url);
    setState(() {
      _currentUrl = url;
      _hasError = false;
      _isLoading = true;
    });
    _controller.loadRequest(Uri.parse(url));
  }

  void _initWebViewController() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.black)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            setState(() {
              _loadingProgress = progress / 100.0;
            });
          },
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
              _hasError = false;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            // Ignore minor errors that don't disrupt loading
            if (error.description.contains("ERR_CONNECTION_REFUSED") ||
                error.description.contains("ERR_NAME_NOT_RESOLVED") ||
                error.description.contains("ERR_ADDRESS_UNREACHABLE")) {
              setState(() {
                _hasError = true;
                _isLoading = false;
                _errorMessage = error.description;
              });
            }
          },
          onNavigationRequest: (NavigationRequest request) {
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(_currentUrl));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // WebView
            if (!_hasError)
              WebViewWidget(controller: _controller)
            else
              _buildErrorView(),

            // Top Linear Progress Bar
            if (_isLoading && !_hasError)
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                child: LinearProgressIndicator(
                  value: _loadingProgress,
                  backgroundColor: Colors.transparent,
                  color: const Color(0xFF8A2BE2),
                ),
              ),

            // Settings Floating Toggle Button
            Positioned(
              bottom: 16,
              right: 16,
              child: Opacity(
                opacity: 0.6,
                child: FloatingActionButton.small(
                  backgroundColor: Colors.grey[900],
                  foregroundColor: const Color(0xFF8A2BE2),
                  onPressed: () {
                    setState(() {
                      _showSettings = !_showSettings;
                    });
                  },
                  child: Icon(_showSettings ? Icons.close : Icons.settings),
                ),
              ),
            ),

            // Settings Sheet overlay
            if (_showSettings) _buildSettingsSheet(),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorView() {
    return Container(
      color: Colors.black,
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Colors.red[950],
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.wifi_off_rounded,
              color: Colors.red,
              size: 48,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Unable to Connect',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Could not reach the server at:\n$_currentUrl',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Error: $_errorMessage',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              OutlinedButton.icon(
                onPressed: () {
                  setState(() {
                    _showSettings = true;
                  });
                },
                icon: const Icon(Icons.edit_road),
                label: const Text('Change URL'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF8A2BE2),
                  side: const BorderSide(color: Color(0xFF8A2BE2)),
                ),
              ),
              const SizedBox(width: 16),
              ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    _isLoading = true;
                    _hasError = false;
                  });
                  _controller.loadRequest(Uri.parse(_currentUrl));
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8A2BE2),
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSheet() {
    return Container(
      color: Colors.black87,
      child: Center(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 24.0),
          padding: const EdgeInsets.all(24.0),
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.circular(16.0),
            border: Border.all(color: Colors.grey[850]!),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Row(
                children: [
                  Icon(Icons.settings, color: Color(0xFF8A2BE2)),
                  SizedBox(width: 8),
                  Text(
                    'Orbit Partner Configuration',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'Enter the URL of your Next.js server. Use http://10.0.2.2:3000/?role=PARTNER for local Android Emulator or your local IP if running on a real device.',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _urlInputController,
                decoration: const InputDecoration(
                  labelText: 'Server URL',
                  hintText: 'e.g. http://10.0.2.2:3000/?role=PARTNER',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.link),
                ),
                keyboardType: TextInputType.url,
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _showSettings = false;
                      });
                    },
                    child: const Text('Cancel'),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: () {
                      _saveUrl(_urlInputController.text.trim());
                      setState(() {
                        _showSettings = false;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8A2BE2),
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Connect'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
