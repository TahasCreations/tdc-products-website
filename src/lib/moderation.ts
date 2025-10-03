import "server-only";

export async function assertModerateOk(imageUrlOrGcs: string): Promise<void> {
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/moderate/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUrl: imageUrlOrGcs.startsWith('http') ? imageUrlOrGcs : undefined,
      gcsUri: imageUrlOrGcs.startsWith('gs://') ? imageUrlOrGcs : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error('Moderation service unavailable');
  }

  const result = await response.json();

  if (result.reject) {
    throw new Error('image_rejected');
  }
}
