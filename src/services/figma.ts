import { FigmaTextNode } from '../types';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  children?: FigmaNode[];
  visible?: boolean;
}

interface FigmaFileResponse {
  document: FigmaNode;
  name: string;
}

// UI 区域识别关键词
const AREA_KEYWORDS = {
  '导航栏': ['nav', 'navigation', 'navbar', 'menu', 'header', '顶部', '导航'],
  '页头': ['hero', 'banner', 'head', 'page head', '页头', '头图'],
  '侧边栏': ['sidebar', 'side bar', 'aside', '侧边', 'side'],
  '主体内容': ['content', 'main', 'body', 'section', '主体', '内容'],
  '页脚': ['footer', 'foot', 'bottom', '页脚', '底部'],
  '按钮区': ['button', 'btn', 'cta', 'action', '按钮', '操作'],
  '表单': ['form', 'input', 'login', 'signup', 'register', '表单', '登录', '注册'],
  '卡片': ['card', 'cards', '卡片'],
  '列表': ['list', 'items', '列表', '清单'],
  '表格': ['table', 'grid', '表格', '网格'],
  '弹窗': ['modal', 'dialog', 'popup', 'overlay', '弹窗', '对话框'],
  '标签栏': ['tab', 'tabs', '标签', '选项卡'],
  '面包屑': ['breadcrumb', 'breadcrumbs', '面包屑'],
  '分页': ['pagination', 'pager', '分页'],
  '筛选区': ['filter', 'filters', 'sort', '筛选', '排序'],
  '搜索': ['search', '搜索'],
  '轮播': ['carousel', 'slider', '轮播', '滑动'],
};

// 识别区域
function identifyArea(nodePath: string[]): string {
  const path = nodePath.join(' ').toLowerCase();

  for (const [area, keywords] of Object.entries(AREA_KEYWORDS)) {
    for (const keyword of keywords) {
      if (path.includes(keyword.toLowerCase())) {
        return area;
      }
    }
  }

  return '其他';
}

// 检查是否是纯数字（包括整数和小数）
function isPureNumber(text: string): boolean {
  return /^\d+(\.\d+)?$/.test(text.trim());
}

export class FigmaService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private extractFileKey(url: string): string | null {
    const patterns = [
      /figma\.com\/file\/([a-zA-Z0-9]+)/,
      /figma\.com\/design\/([a-zA-Z0-9]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  private extractNodeId(url: string): string | null {
    const match = url.match(/node-id=([0-9]+-[0-9]+)/);
    if (match) {
      return match[1].replace('-', ':');
    }
    return null;
  }

  private findNodeById(node: FigmaNode, nodeId: string): FigmaNode | null {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeById(child, nodeId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private findParentPageName(targetNode: FigmaNode, pages: FigmaNode[]): string {
    for (const page of pages) {
      if (this.isDescendantOf(page, targetNode)) {
        return page.name;
      }
    }
    return 'Unknown Page';
  }

  private isDescendantOf(ancestor: FigmaNode, descendant: FigmaNode): boolean {
    const checkChildren = (parent: FigmaNode): boolean => {
      if (parent.children) {
        for (const child of parent.children) {
          if (child.id === descendant.id) {
            return true;
          }
          if (checkChildren(child)) {
            return true;
          }
        }
      }
      return false;
    };
    return checkChildren(ancestor);
  }

  async fetchFile(url: string): Promise<FigmaFileResponse> {
    const fileKey = this.extractFileKey(url);
    if (!fileKey) {
      throw new Error('Invalid Figma URL');
    }

    console.log('Fetching Figma file:', { fileKey, url });

    const apiUrl = `https://api.figma.com/v1/files/${fileKey}`;

    console.log('Using API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Figma API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        fileKey,
        apiUrl,
      });

      if (response.status === 403) {
        throw new Error('Access denied. Please check that: 1) Token is valid; 2) File is accessible by you; 3) File is set to "Anyone with the link can view"');
      } else if (response.status === 404) {
        throw new Error('File not found. Please check that: 1) File ID is correct; 2) File is set to "Anyone with the link can view"; 3) The file is not deleted');
      }
      throw new Error(`Figma API error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  extractTextNodes(
    node: FigmaNode,
    pageName: string,
    nodePath: string[] = [],
    topFrameName: string = '',
    canvasName: string = ''
  ): FigmaTextNode[] {
    // 如果节点被隐藏，跳过
    if (node.visible === false) {
      console.log('Skipping hidden node:', node.name);
      return [];
    }

    const textNodes: FigmaTextNode[] = [];

    const currentPath = [...nodePath, node.name];

    // 如果是 CANVAS 类型，记录画布名称
    if (node.type === 'CANVAS') {
      canvasName = node.name;
    }

    // 如果是 FRAME 或 COMPONENT 类型，记录为顶级 Frame
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      topFrameName = node.name;
    }

    // 是文本节点且不是纯数字
    if (node.type === 'TEXT' && node.characters && node.characters.trim()) {
      const text = node.characters.trim();
      if (!isPureNumber(text)) {
        const area = identifyArea(currentPath);
        
        textNodes.push({
          id: node.id,
          name: node.name,
          characters: text,
          pageName: pageName,
          frameName: topFrameName || undefined,
          area: canvasName || topFrameName || undefined,
        });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        textNodes.push(
          ...this.extractTextNodes(child, pageName, currentPath, topFrameName, canvasName)
        );
      }
    }

    return textNodes;
  }

  async extractAllTextNodes(url: string): Promise<FigmaTextNode[]> {
    const file = await this.fetchFile(url);
    const textNodes: FigmaTextNode[] = [];

    console.log('Figma file loaded:', file.name);

    const nodeId = this.extractNodeId(url);
    const pages = file.document.children;
    
    if (nodeId) {
      console.log('Target node ID:', nodeId);
      const targetNode = this.findNodeById(file.document, nodeId);
      
      if (!targetNode) {
        throw new Error(`Node not found with ID: ${nodeId}. Please check your Figma URL.`);
      }

      const pageName = this.findParentPageName(targetNode, pages);
      console.log('Processing specific node:', targetNode.name, 'from page:', pageName);
      const nodes = this.extractTextNodes(targetNode, pageName);
      textNodes.push(...nodes);
    } else {
      console.log('No node-id specified, processing all pages');
      for (const page of pages) {
        console.log('Processing page:', page.name);
        const nodes = this.extractTextNodes(page, page.name);
        textNodes.push(...nodes);
      }
    }

    console.log(`Extracted ${textNodes.length} text nodes`);
    return textNodes;
  }
}

export const createFigmaService = (accessToken: string) => {
  return new FigmaService(accessToken);
};
