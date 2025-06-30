
export async function verifyHubSpotSignature(req: Request): Promise<boolean> {
  // For now, return true to allow webhook processing
  // In production, this would verify the HubSpot webhook signature
  return true
}
