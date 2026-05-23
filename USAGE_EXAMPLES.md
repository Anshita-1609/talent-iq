# Code Analysis Feature - Usage Examples

## 📚 Example 1: Two Sum Problem

### User Writes Code:
```javascript
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6));     // Expected: [1, 2]
console.log(twoSum([3, 3], 6));        // Expected: [0, 1]
```

### Output Tab Shows:
```
[0,1]
[1,2]
[0,1]
```

### AI Analysis Tab Shows:

#### ✅ Correctness: Passed
- All test cases pass correctly

#### ⚡ Complexity Analysis
- **Time Complexity**: O(n) - Single pass through array
- **Space Complexity**: O(n) - Hash map storage
- **Rating**: ✅ Optimized

#### 💡 Feedback
**Strengths:**
- Efficient use of hash map
- Optimal time complexity
- Clean and readable code

**Areas for Improvement:**
- Could add input validation
- Error handling for edge cases

**Overall Assessment:** 
Excellent solution! Uses the hash map approach efficiently to solve the problem in linear time.

#### 📊 Suggested Improvements
1. **Performance**
   - Current approach is already optimal
   - No significant performance improvements available

2. **Readability**
   - Consider adding JSDoc comments
   - Example:
   ```javascript
   /**
    * Finds two numbers that sum to target
    * @param {number[]} nums - Array of integers
    * @param {number} target - Target sum
    * @return {number[]} - Indices of two numbers
    */
   ```

---

## 📚 Example 2: Suboptimal Solution

### User Writes Code:
```javascript
function twoSum(nums, target) {
  // Brute force approach
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
```

### AI Analysis Shows:

#### ⚠️ Correctness: Passed
- Tests pass but solution is not optimal

#### ⚡ Complexity Analysis
- **Time Complexity**: O(n²) - Nested loops
- **Space Complexity**: O(1) - No extra space
- **Rating**: ⚠️ Suboptimal

#### 💡 Feedback
**Strengths:**
- Correct logic
- No extra space used
- Simple to understand

**Areas for Improvement:**
- Time complexity can be improved to O(n)
- Could use hash map for better performance

**Overall Assessment:**
Functional but inefficient. Consider using a hash map to optimize.

#### 📊 Suggested Improvements
1. **Performance** (HIGH PRIORITY)
   - Current: O(n²) - becomes slow with large inputs
   - Suggested: O(n) using hash map
   - Example:
   ```javascript
   function twoSum(nums, target) {
     const seen = new Map();
     for (let i = 0; i < nums.length; i++) {
       if (seen.has(target - nums[i])) {
         return [seen.get(target - nums[i]), i];
       }
       seen.set(nums[i], i);
     }
     return [];
   }
   ```

---

## 📚 Example 3: Code with Errors

### User Writes Code:
```javascript
function twoSum(nums, target) {
  // Missing initialization
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {  // ❌ map not defined
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
```

### Output Tab Shows:
```
Error: map is not defined
```

### AI Analysis Shows:

#### ❌ Correctness: Failed
Issues Found:
- 🔴 Error: Line 4 - Variable 'map' is not defined
- 💡 Suggestion: Initialize Map before using it
- ⚠️ Warning: Missing input validation

#### 💡 Feedback
**Strengths:**
- Algorithm logic is sound

**Areas for Improvement:**
- Variable initialization missing
- Lack of error handling

**Overall Assessment:**
Code has a bug. Variable 'map' needs to be initialized as `new Map()` before line 3.

#### 📊 Suggested Improvements
1. **Correctness Issues**
   ```javascript
   // Add this at the beginning of function:
   const map = new Map();
   ```

---

## 🎯 Workflow Tips

### For Learning
1. Write code
2. Click Run Code
3. Check Output
4. Review AI Analysis for feedback
5. Understand suggestions
6. Re-implement with improvements
7. Compare complexity ratings

### For Optimization
1. Run working code
2. Note complexity analysis
3. Review "Suggested Improvements"
4. Try the suggested approach
5. Run again to verify
6. Compare before/after analysis

### For Code Review
1. Review feedback items
2. Understand "Strengths"
3. Address "Areas for Improvement"
4. Implement suggestions
5. Get fresh analysis
6. Iterate until optimal

---

## 📊 Analysis Response Structure

```
Output Tab
├── Success ✓
│   └── Shows console.log output
├── Error ✗
│   └── Shows error message with details
└── Partial ⚠️
    ├── Shows output
    └── Shows error message

Analysis Tab
├── Correctness Section
│   ├── Pass/Fail Status
│   └── Issues Found (if any)
│
├── Complexity Analysis
│   ├── Time Complexity
│   ├── Space Complexity
│   └── Optimization Rating
│
├── Feedback Section
│   ├── Strengths
│   ├── Areas for Improvement
│   └── Overall Assessment
│
└── Improvements Section
    ├── Performance Suggestions
    ├── Readability Suggestions
    ├── Efficiency Suggestions
    └── Design Suggestions
```

---

## 🔄 UI States

### While Code Runs
- "Run Code" button shows: "Running... ⌛"
- Button is disabled
- Output area is empty

### After Code Runs
- "Run Code" button is enabled
- Output tab is active
- Analysis tab shows loading if analysis hasn't completed
- Toast notification: "✓ All tests passed!" or "✗ Tests failed!"

### Analysis Complete
- Analysis tab becomes clickable
- Click to view AI-generated feedback
- Toast notification: "✓ AI analysis ready!"

### Error State
- Output tab shows error message
- Analysis tab shows error details
- Toast notification: "✗ Code execution failed!"

---

## 💾 Persistence

Note: Analysis is **NOT** saved between page refreshes. It's only shown during the current session:
- Change language → Analysis clears
- Switch to different problem → Analysis clears
- Refresh page → Analysis clears
- Run new code → Previous analysis clears

---

## 🚀 Performance Expectations

| Action | Time |
|--------|------|
| Code Execution | <5 seconds |
| AI Analysis | 2-10 seconds |
| Display Update | <1 second |
| Total End-to-End | ~5-15 seconds |

---

## ❓ FAQ

**Q: Can I use the analysis in multiple languages?**
A: Yes! The analysis works for JavaScript, Python, and Java.

**Q: How detailed is the AI feedback?**
A: Very detailed - it checks correctness, complexity, performance, readability, and provides specific code examples.

**Q: Can I get different AI models?**
A: Currently using GPT-4o-mini. Can be changed in backend for other models.

**Q: Is my code stored?**
A: No. Code is analyzed on-the-fly and not persisted to database.

**Q: What if analysis fails?**
A: You'll see error message in analysis tab and console. Backend logs will have details.

