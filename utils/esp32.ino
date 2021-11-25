#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include "DHT.h"

#define pinDHT 4
#define pinLED 5
#define DHTTYPE DHT11

const char *ssid = "";     // Enter SSID here
const char *password = ""; //Enter Password here

int iteration = 600;

String serverURLTemp = ""; // Enter temperature iot url
String secretTemp = "";    // Enter temperature iot secret

String serverURLHumi = ""; // Enter humidity iot url
String secretHumi = "";    // Enter humidity iot secret

int cont = 0;

WebServer server(80);

DHT dht(pinDHT, DHTTYPE);

float Temperature;
float Humidity;

void setup()
{
    Serial.begin(115200);
    delay(100);

    pinMode(pinDHT, INPUT);
    pinMode(pinLED, OUTPUT);
    dht.begin();

    Serial.print("Connected to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    Serial.println("");

    server.on("/led", handleLed);

    server.begin();
    Serial.println("HTTP server started");
}

void loop()
{
    server.handleClient();
    delay(100);
    if (iteration == 600)
    {
        iteration = 0;
        Temperature = dht.readTemperature();
        Humidity = dht.readHumidity();
        Serial.print("Request Number: ");
        Serial.print(++cont);
        Serial.print(" Temp: ");
        Serial.print(Temperature);
        Serial.print(" Humi: ");
        Serial.println(Humidity);
        sendRequest(serverURLTemp, secretTemp, Temperature);
        sendRequest(serverURLHumi, secretHumi, Humidity);
    }
    iteration++;
}

void handleLed()
{
    server.send(200, "text/json", "{\"success\": true}");
    Serial.println("Server receiver request on /led")
        digitalWrite(pinLED, 1);
    delay(5000);
    digitalWrite(pinLED, 0);
}

void sendRequest(String server, String secret, float value)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        WiFiClient client;
        HTTPClient http;
        http.begin(client, server);
        http.addHeader("Content-Type", "application/json");
        String json = "{ \"value\":\"";
        json += value;
        json += "\", \"secret\":\"";
        json += secret;
        json += "\" }";

        int httpResponseCode = http.POST(json);
        http.end();
    }
}