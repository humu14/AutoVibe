import React, { useEffect, useState } from 'react';
import { useGetAllProductQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

const LatestProducts = () => {
    const { data, isLoading, refetch, error } = useGetAllProductQuery();
    const navigate = useNavigate();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const displayedProducts = Array.isArray(data) ? data.slice(0, 8) : [];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Latest Products
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover our newest car accessories and stay ahead with the latest automotive innovations
                    </p>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-red-500 text-xl">Error loading products</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {displayedProducts.map((product) => (
                                <div key={product._id} className="transform hover:scale-105 transition-transform duration-300">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        
                        {/* See All Button */}
                        {data && data.length > 8 && (
                            <div className="text-center mt-8">
                                <LinkContainer to="/allProducts">
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                        View All Products
                                    </Button>
                                </LinkContainer>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default LatestProducts;
