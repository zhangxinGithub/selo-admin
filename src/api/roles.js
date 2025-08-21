import ajax from "@/ajax/index.js";

/**
 * 获取角色列表（分页）
 * @param {Object} params - 请求参数
 * @param {Object} params.pagination - 分页信息
 * @param {number} params.pagination.current - 当前页码
 * @param {number} params.pagination.pageSize - 每页条数
 * @param {string} params.searchText - 搜索关键词
 * @returns {Promise<Object>} - 返回角色列表和分页信息
 */
export const getAllRoleListPage = async (params = {}) => {
	return await ajax("/app/customRole/allRoleListPage", "POST", params);
};

export const addRole = async (params = {}) => {
	return await ajax("/app/customRole/add", "POST", params);
};
