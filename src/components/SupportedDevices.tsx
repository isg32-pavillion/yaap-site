import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// IMPORTANT: Replace 'YOUR_GITHUB_TOKEN' with your actual Personal Access Token.
// For production apps, you should use environment variables for security.
const GITHUB_TOKEN = "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";

interface Device {
  name: string;
  maintainer: string;
  status: string;
  image?: string;
  filename: string;
}

interface DeviceGroup {
  oem: string;
  devices: Device[];
}

const statusIcons = {
  official: CheckCircle,
  unofficial: Clock,
  discontinued: AlertCircle,
};

const statusColors = {
  official: "bg-green-500/20 text-green-400 border-green-500/30",
  unofficial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  discontinued: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function SupportedDevices() {
  const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to fetch data with exponential backoff and authentication
  const fetchWithRetry = async (url: string, retries = 5, delay = 1000) => {
    try {
      // Add Authorization header with the personal access token
      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
      };
      
      const response = await axios.get(url, { headers });
      return response;
    } catch (err: any) {
      // Check for rate limit error (status 403 or 429) and if retries remain
      if ((err.response?.status === 403 || err.response?.status === 429) && retries > 0) {
        console.warn(`Rate limit exceeded. Retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(url, retries - 1, delay * 2); // Double the delay
      }
      throw err; // Re-throw other errors or if retries are exhausted
    }
  };

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the device list from GitHub API with retry logic
      const response = await fetchWithRetry(
        "https://api.github.com/repos/yaap/device-info/contents/"
      );

      const devices: Device[] = [];
      
      // Use Promise.all to fetch device JSON files concurrently
      const deviceFetchPromises = response.data
        .filter((item: any) => item.type === "dir")
        .map(async (item: any) => {
          try {
            const deviceResponse = await fetchWithRetry(
              `https://api.github.com/repos/yaap/device-info/contents/${item.name}/${item.name}.json`
            );
            
            const deviceData = JSON.parse(atob(deviceResponse.data.content));
            
            return {
              name: deviceData.name || item.name,
              maintainer: deviceData.maintainer || "Unknown",
              status: deviceData.status || "unofficial",
              image: deviceData.image,
              filename: item.name,
            };
          } catch (err) {
            console.error(`Error fetching device data for ${item.name}:`, err);
            return null; // Return null on error to filter it out later
          }
        });

      // Wait for all concurrent fetches to complete
      const fetchedDevices = await Promise.all(deviceFetchPromises);
      
      // Filter out any devices that failed to fetch
      const validDevices = fetchedDevices.filter(d => d !== null) as Device[];

      // Group devices by OEM (first word of device name)
      const groups: { [key: string]: Device[] } = {};
      
      validDevices.forEach((device) => {
        const oem = device.name.split(" ")[0] || "Other";
        if (!groups[oem]) {
          groups[oem] = [];
        }
        groups[oem].push(device);
      });

      const sortedGroups = Object.entries(groups)
        .map(([oem, devices]) => ({ oem, devices }))
        .sort((a, b) => a.oem.localeCompare(b.oem));

      setDeviceGroups(sortedGroups);
    } catch (err) {
      setError("Failed to fetch device information after multiple retries. Please try again later.");
      console.error("Final error fetching devices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDownload = (device: Device) => {
    navigate(`/device/${device.filename}`);
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
              Supported Devices
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
              Supported Devices
            </h2>
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="supported-devices" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Supported Devices
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose your device and get started with YAAP
          </p>
        </div>

        {deviceGroups.map((group) => (
          <div key={group.oem} className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-accent">
              {group.oem}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.devices.map((device) => {
                const StatusIcon = statusIcons[device.status as keyof typeof statusIcons] || Clock;
                
                return (
                  <Card key={device.filename} className="gradient-surface border-border hover:shadow-card transition-smooth">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold line-clamp-2">
                            {device.name}
                          </CardTitle>
                        </div>
                        <Smartphone className="w-6 h-6 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {device.image && (
                        <div className="h-40 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={device.image}
                            alt={device.name}
                            className="h-full px-2 py-2 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {device.maintainer}
                          </span>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className={`${statusColors[device.status as keyof typeof statusColors] || statusColors.unofficial} flex items-center gap-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {device.status}
                        </Badge>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button
                        onClick={() => handleDownload(device)}
                        variant="gradient"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
