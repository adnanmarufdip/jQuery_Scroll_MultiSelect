
/**
 * jQuery Scroll Multi-Select Plugin
 * A customizable multi-select component with search functionality
 * 
 * Usage:
 * $('#my-container').multiSelect({
 *   items: [{ id: 1, label: 'Option 1', value: 'option1' }],
 *   placeholder: 'Select items...',
 *   searchPlaceholder: 'Search...',
 *   onSelectionChange: function(selectedValues) { console.log(selectedValues); }
 * });
 */

(function ($) {
    'use strict';

    // Plugin defaults
    var defaults = {
        items: [],
        placeholder: 'Select items...',
        searchPlaceholder: 'Search...',
        maxHeight: '300px',
        showSelectedPreview: true,
        maxPreviewItems: 3,
        onSelectionChange: function () { }
    };

    // Plugin constructor
    function MultiSelect(element, options) {
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this.selectedValues = [];
        this.filteredItems = [...this.options.items];
        this.init();
    }

    // Plugin prototype
    MultiSelect.prototype = {
        init: function () {
            this.render();
            this.setupEventListeners();
            this.updateHeader();
        },

        render: function () {
            var html = this.getTemplate();
            this.element.html(html);
            this.renderItems();
        },

        getTemplate: function () {
            return `
                <div class="multi-select">
                    <div class="multi-select-header">
                        <div class="multi-select-header-content">
                            <span class="selection-count">${this.options.placeholder}</span>
                            <button class="clear-all-btn" style="display: none;">Clear All</button>
                        </div>
                        ${this.options.showSelectedPreview ? '<div class="selected-items-preview"></div>' : ''}
                    </div>
                    <div class="multi-select-search">
                        <div class="search-container">
                            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input type="text" class="search-input" placeholder="${this.options.searchPlaceholder}">
                            <button class="clear-search-btn" style="display: none;">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="multi-select-items" style="max-height: ${this.options.maxHeight};">
                        <div class="items-container"></div>
                    </div>
                </div>
            `;
        },

        setupEventListeners: function () {
            var self = this;

            // Search input
            this.element.find('.search-input').on('input', function () {
                self.handleSearch($(this).val());
            });

            // Clear search
            this.element.find('.clear-search-btn').on('click', function () {
                self.clearSearch();
            });

            // Clear all selections
            this.element.find('.clear-all-btn').on('click', function () {
                self.clearAllSelections();
            });
        },

        handleSearch: function (searchTerm) {
            this.filteredItems = this.options.items.filter(function (item) {
                return item.label.toLowerCase().includes(searchTerm.toLowerCase());
            });
            this.renderItems();

            // Show/hide clear search button
            if (searchTerm) {
                this.element.find('.clear-search-btn').show();
            } else {
                this.element.find('.clear-search-btn').hide();
            }
        },

        clearSearch: function () {
            this.element.find('.search-input').val('');
            this.element.find('.clear-search-btn').hide();
            this.filteredItems = [...this.options.items];
            this.renderItems();
        },

        renderItems: function () {
            var container = this.element.find('.items-container');
            container.empty();

            if (this.filteredItems.length === 0) {
                this.renderNoResults(container);
                return;
            }

            var self = this;
            this.filteredItems.forEach(function (item) {
                self.renderItem(container, item);
            });
        },

        renderItem: function (container, item) {
            var self = this;
            var isSelected = this.selectedValues.includes(item.value);
            var itemHtml = `
                <div class="multi-select-item" data-value="${item.value}">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} data-value="${item.value}">
                    <label>${item.label}</label>
                </div>
            `;

            var itemElement = $(itemHtml);

            itemElement.on('click', function () {
                self.toggleItem(item.value);
            });

            itemElement.find('input').on('click', function (e) {
                e.stopPropagation();
                self.toggleItem(item.value);
            });

            container.append(itemElement);
        },

        renderNoResults: function (container) {
            var noResultsHtml = `
                <div class="no-results">
                    <svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p>No items found</p>
                    <p>Try adjusting your search terms</p>
                </div>
            `;
            container.append(noResultsHtml);
        },

        toggleItem: function (value) {
            var index = this.selectedValues.indexOf(value);
            if (index > -1) {
                this.selectedValues.splice(index, 1);
            } else {
                this.selectedValues.push(value);
            }

            this.updateHeader();
            this.updateCheckboxes();
            this.options.onSelectionChange(this.selectedValues);
        },

        updateCheckboxes: function () {
            var self = this;
            this.element.find('input[type="checkbox"]').each(function () {
                var value = $(this).data('value');
                $(this).prop('checked', self.selectedValues.includes(value));
            });
        },

        updateHeader: function () {
            var countElement = this.element.find('.selection-count');
            var clearButton = this.element.find('.clear-all-btn');
            var previewContainer = this.element.find('.selected-items-preview');

            if (this.selectedValues.length === 0) {
                countElement.text(this.options.placeholder);
                clearButton.hide();
                if (this.options.showSelectedPreview) {
                    previewContainer.empty();
                }
            } else {
                var count = this.selectedValues.length;
                countElement.text(count + ' item' + (count > 1 ? 's' : '') + ' selected');
                clearButton.show();
                if (this.options.showSelectedPreview) {
                    this.updateSelectedPreview();
                }
            }
        },

        updateSelectedPreview: function () {
            var self = this;
            var previewContainer = this.element.find('.selected-items-preview');
            previewContainer.empty();

            var selectedItems = this.options.items.filter(function (item) {
                return self.selectedValues.includes(item.value);
            });

            selectedItems.slice(0, this.options.maxPreviewItems).forEach(function (item) {
                previewContainer.append('<span class="selected-tag">' + item.label + '</span>');
            });

            if (selectedItems.length > this.options.maxPreviewItems) {
                previewContainer.append('<span class="selected-tag more-tag">+' + (selectedItems.length - this.options.maxPreviewItems) + ' more</span>');
            }
        },

        clearAllSelections: function () {
            this.selectedValues = [];
            this.updateHeader();
            this.updateCheckboxes();
            this.options.onSelectionChange(this.selectedValues);
        },

        // Public methods
        getSelectedValues: function () {
            return [...this.selectedValues];
        },

        setSelectedValues: function (values) {
            this.selectedValues = [...values];
            this.updateHeader();
            this.updateCheckboxes();
            this.options.onSelectionChange(this.selectedValues);
        },

        updateItems: function (items) {
            this.options.items = items;
            this.filteredItems = [...items];
            this.renderItems();
        },

        destroy: function () {
            this.element.empty();
            this.element.removeData('multiSelect');
        }
    };

    // jQuery plugin definition
    $.fn.multiSelect = function (options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var instance = $(this).data('multiSelect');

            if (!instance) {
                instance = new MultiSelect(this, options);
                $(this).data('multiSelect', instance);
            } else if (typeof options === 'string') {
                // Call public methods
                if (typeof instance[options] === 'function') {
                    return instance[options].apply(instance, args);
                }
            }
        });
    };

    // Plugin defaults accessible
    $.fn.multiSelect.defaults = defaults;

})(jQuery);