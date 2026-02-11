
import { GithubContent } from '../types';
import { GITHUB_USER, GITHUB_REPO } from '../constants';

const BASE_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents`;

export const fetchDirectory = async (path: string = ''): Promise<GithubContent[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${path}`);
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Failed to fetch from GitHub');
    }
    return await response.json();
  } catch (error) {
    console.error('GitHub fetch error:', error);
    return [];
  }
};

export const getRawUrl = (path: string) => {
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${path}`;
};
