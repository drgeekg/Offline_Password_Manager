import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertCircle } from "lucide-react";
import { Password } from "@shared/schema";
import { getOverallHealth } from "@/lib/password-health";

export function PasswordHealth({ 
  passwords, 
  masterKey 
}: { 
  passwords: Password[]; 
  masterKey: string;
}) {
  const health = getOverallHealth(passwords, masterKey);
  
  const getScoreColor = (score: number) => {
    if (score < 40) return "text-red-500";
    if (score < 60) return "text-yellow-500";
    if (score < 80) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Overall Score</span>
              <span className={`font-medium ${getScoreColor(health.score)}`}>
                {health.score}%
              </span>
            </div>
            <Progress value={health.score} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{health.total}</div>
              <div className="text-xs text-muted-foreground">Total Passwords</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{health.weak}</div>
              <div className="text-xs text-muted-foreground">Weak Passwords</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{health.reused}</div>
              <div className="text-xs text-muted-foreground">Reused Passwords</div>
            </div>
          </div>

          {/* Recommendations */}
          {(health.weak > 0 || health.reused > 0) && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Recommendations
              </h4>
              <ul className="text-sm space-y-2">
                {health.weak > 0 && (
                  <li className="text-muted-foreground">
                    • {health.weak} passwords are weak and should be updated
                  </li>
                )}
                {health.reused > 0 && (
                  <li className="text-muted-foreground">
                    • {health.reused} passwords are reused across multiple accounts
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
