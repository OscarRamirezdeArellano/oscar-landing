/**
 * Virtual filesystem for the terminal.
 * Used by `ls`, `cd`, `cat`, `tree`, `pwd`.
 */

import { PROJECTS } from './data/projects';
import { SKILLS } from './data/skills';
import { EXPERIENCE } from './data/experience';
import { SERVICES } from './data/services';

export type VFile = {
  name: string;
  type: 'file' | 'dir';
  resolver?: string; // for files: which command renders this
  payload?: string; // optional payload (e.g. project slug)
  children?: VNode[];
};

export type VNode = VFile;

function projectsDir(): VNode {
  return {
    name: 'projects',
    type: 'dir',
    children: PROJECTS.map((p) => ({
      name: p.slug,
      type: 'file',
      resolver: 'cat-project',
      payload: p.slug,
    })),
  };
}

function skillsDir(): VNode {
  return {
    name: 'skills',
    type: 'dir',
    children: SKILLS.map((s) => ({
      name: s.slug,
      type: 'file',
      resolver: 'cat-skill',
      payload: s.slug,
    })),
  };
}

function experienceDir(): VNode {
  return {
    name: 'experience',
    type: 'dir',
    children: EXPERIENCE.map((e, idx) => ({
      name: e.period.replace(/[\s–]+/g, '_'),
      type: 'file',
      resolver: 'cat-experience',
      payload: String(idx),
    })),
  };
}

function servicesDir(): VNode {
  return {
    name: 'services',
    type: 'dir',
    children: SERVICES.map((s) => ({
      name: s.slug,
      type: 'file',
      resolver: 'cat-service',
      payload: s.slug,
    })),
  };
}

export const ROOT: VNode = {
  name: '~',
  type: 'dir',
  children: [
    projectsDir(),
    servicesDir(),
    skillsDir(),
    experienceDir(),
    { name: 'about.md', type: 'file', resolver: 'cat-about' },
    { name: 'contact.md', type: 'file', resolver: 'cat-contact' },
    { name: 'cv', type: 'dir', children: [
      { name: 'resume_en.pdf', type: 'file', resolver: 'cat-cv', payload: 'en' },
      { name: 'resume_es.pdf', type: 'file', resolver: 'cat-cv', payload: 'es' },
    ]},
    { name: '.zshrc', type: 'file', resolver: 'cat-zshrc' },
  ],
};

export function resolvePath(cwd: string, target?: string): { path: string; node: VNode } | null {
  // Normalize
  let path = target ?? cwd;
  if (!path) path = '~';
  if (path === '~' || path === '/') return { path: '~', node: ROOT };

  // Handle relative paths
  if (!path.startsWith('~') && !path.startsWith('/')) {
    if (path === '..') {
      const parts = cwd.split('/').filter(Boolean);
      parts.pop();
      path = parts.length === 0 ? '~' : parts.join('/');
    } else if (path === '.') {
      path = cwd;
    } else {
      path = cwd === '~' ? `~/${path}` : `${cwd}/${path}`;
    }
  }

  // Walk
  const parts = path.split('/').filter(Boolean).filter((p) => p !== '~');
  let current = ROOT;
  for (const part of parts) {
    if (current.type !== 'dir' || !current.children) return null;
    const next = current.children.find((c) => c.name === part);
    if (!next) return null;
    current = next;
  }
  // Reconstruct normalized path
  const normalized = parts.length === 0 ? '~' : `~/${parts.join('/')}`;
  return { path: normalized, node: current };
}

export function listChildren(node: VNode): VNode[] {
  if (node.type !== 'dir' || !node.children) return [];
  return node.children;
}
