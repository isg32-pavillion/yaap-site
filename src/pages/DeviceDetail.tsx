import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, User, CheckCircle, Clock, AlertCircle, Smartphone } from "lucide-react";
import axios from "axios";

interface DeviceData {
  name: string;
  maintainer: string;
  status: string;
  image?: string;
  description?: string;
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

export default function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<DeviceData | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deviceId) {
      fetchDeviceData();
    }
  }, [deviceId]);

  const fetchDeviceData = async () => {
    if (!deviceId) return;

    try {
      setLoading(true);
      
      // Fetch device JSON data
      const deviceResponse = await axios.get(
        `https://api.github.com/repos/yaap/device-info/contents/${deviceId}/${deviceId}.json`
      );
      
      const deviceData = JSON.parse(atob(deviceResponse.data.content));
      setDevice(deviceData);

      // Fetch markdown content
      try {
        const markdownResponse = await axios.get(
          `https://api.github.com/repos/yaap/device-info/contents/${deviceId}/${deviceId}.md`
        );
        const markdownContent = atob(markdownResponse.data.content);
        setMarkdown(markdownContent);
      } catch (err) {
        console.error("Error fetching markdown:", err);
        setMarkdown("No additional information available.");
      }

    } catch (err) {
      setError("Failed to fetch device information");
      console.error("Error fetching device data:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadUrl = `https://mirror.codebucket.de/yaap/${deviceId}/`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading device information...</p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Device Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested device could not be found."}</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[device.status as keyof typeof statusIcons] || Clock;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Devices
            </Button>
          </Link>
        </div>

        {/* Device Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="gradient-surface border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-4">
                      {device.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Maintained by {device.maintainer}
                        </span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[device.status as keyof typeof statusColors] || statusColors.unofficial} flex items-center gap-1`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                  <Smartphone className="w-12 h-12 text-muted-foreground flex-shrink-0 ml-4" />
                </div>
              </CardHeader>
              
              <CardContent>
                {device.image && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-6">
                    <img
                      src={device.image}
                      alt={device.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {device.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {device.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Download Section */}
          <div>
            <Card className="gradient-surface border-border">
              <CardHeader>
                <CardTitle className="text-xl">Download YAAP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Get the latest YAAP build for {device.name}
                </p>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="gradient" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download ROM
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground">
                  Downloads are hosted on our mirror server
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Device Information */}
        {markdown && (
          <Card className="gradient-surface border-border">
            <CardHeader>
              <CardTitle className="text-xl">Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                  {markdown}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}