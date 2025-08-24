import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      // Fetch the device list from GitHub API
      const response = await axios.get(
        "https://api.github.com/repos/yaap/device-info/contents/"
      );

      const devices: Device[] = [];
      
      // Process each directory (device)
      for (const item of response.data) {
        if (item.type === "dir") {
          try {
            // Fetch the device JSON file
            const deviceResponse = await axios.get(
              `https://api.github.com/repos/yaap/device-info/contents/${item.name}/${item.name}.json`
            );
            
            const deviceData = JSON.parse(atob(deviceResponse.data.content));
            
            devices.push({
              name: deviceData.name || item.name,
              maintainer: deviceData.maintainer || "Unknown",
              status: deviceData.status || "unofficial",
              image: deviceData.image,
              filename: item.name,
            });
          } catch (err) {
            console.error(`Error fetching device data for ${item.name}:`, err);
          }
        }
      }

      // Group devices by OEM (first word of device name)
      const groups: { [key: string]: Device[] } = {};
      
      devices.forEach((device) => {
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
      setError("Failed to fetch device information");
      console.error("Error fetching devices:", err);
    } finally {
      setLoading(false);
    }
  };

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
    <section className="py-20 px-4">
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
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                          <img
                            src={device.image}
                            alt={device.name}
                            className="w-full h-full object-cover"
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