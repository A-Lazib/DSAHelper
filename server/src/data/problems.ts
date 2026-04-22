import { Problem } from '../types/index.js';

// In-memory problem bank
export const PROBLEMS: Record<string, Problem> = {
  'two-sum': {
    id: 'two-sum',
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    patterns: ['hashmap', 'two-pointer'],
    expectedTimeComplexity: 'O(n)',
    expectedSpaceComplexity: 'O(n)',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ]
  },

  'contains-duplicate': {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    description:
      'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    difficulty: 'easy',
    patterns: ['hashset', 'array'],
    expectedTimeComplexity: 'O(n)',
    expectedSpaceComplexity: 'O(n)',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
        explanation: '1 appears twice'
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
        explanation: 'All elements are distinct'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ]
  },

  'valid-parentheses': {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if: (1) Open brackets must be closed by the same type of brackets, (2) Open brackets must be closed in the correct order.',
    difficulty: 'easy',
    patterns: ['stack'],
    expectedTimeComplexity: 'O(n)',
    expectedSpaceComplexity: 'O(n)',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only'
    ]
  },

  'longest-substring-without-repeating': {
    id: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'medium',
    patterns: ['sliding-window', 'hashmap'],
    expectedTimeComplexity: 'O(n)',
    expectedSpaceComplexity: 'O(min(m, n))',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: '"abc" has length 3'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: '"b" has length 1'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: '"wke" has length 3'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces'
    ]
  },

  'merge-sorted-array': {
    id: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    description:
      'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of valid elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array. Note: You may assume that nums1 has a length of m + n, so there is enough space to hold additional elements from nums2.',
    difficulty: 'easy',
    patterns: ['two-pointer', 'array'],
    expectedTimeComplexity: 'O(m + n)',
    expectedSpaceComplexity: 'O(1)',
    examples: [
      {
        input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
        output: '[1,2,2,3,5,6]'
      }
    ],
    constraints: [
      '1 <= m, n <= 200',
      '0 <= nums1[i], nums2[i] <= 10^9',
      'm == nums1.length - n'
    ]
  }
};

export function getProblemById(id: string): Problem | null {
  return PROBLEMS[id] || null;
}

export function getAllProblems(): Problem[] {
  return Object.values(PROBLEMS);
}
