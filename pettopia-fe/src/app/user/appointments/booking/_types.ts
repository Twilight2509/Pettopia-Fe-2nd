import type { PetDetailResponse } from '@/services/petcare/petService';

export type Pet = PetDetailResponse;
export type PetServiceMap = Record<string, string[]>;
