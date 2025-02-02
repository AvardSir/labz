/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    let midx = m - 1; // Конец первого массива
    let nidx = n - 1; // Конец второго массива
    let right = m + n - 1; // Конец объединенного массива

    // Слияние двух массивов
    while (nidx >= 0) {
        if (midx >= 0 && nums1[midx] > nums2[nidx]) {
            nums1[right] = nums1[midx];
            midx--;
        } else {
            nums1[right] = nums2[nidx];
            nidx--;
        }
        right--;
    }    
};

// Пример использования
let nums1 = [1, 2, 3, 0, 0, 0]; // Массив nums1 с достаточным местом для nums2
let m = 3; // Количество элементов в nums1
let nums2 = [2, 5, 6]; // Массив nums2
let n = 3; // Количество элементов в nums2

merge(nums1, m, nums2, n);
console.log(nums1); // Вывод: [1, 2, 2, 3, 5, 6]
